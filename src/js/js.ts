import "../../css/css.css";

const drop_el = document.getElementById("drop");
const imgs_el = document.getElementById("img_view");
const upload_pel = document.getElementById("file_input");
const upload_el = document.getElementById("upload") as HTMLInputElement;
const output_el = document.getElementById("r") as HTMLTextAreaElement;

drop_el.ondragover = (e) => {
    e.preventDefault();
};
drop_el.ondrop = (e) => {
    e.preventDefault();
    put_datatransfer(e.dataTransfer);
};
drop_el.onpaste = (e) => {
    e.preventDefault();
    put_datatransfer(e.clipboardData);
};
upload_pel.onclick = () => {
    upload_el.click();
};
upload_el.onchange = () => {
    let files = upload_el.files;
    for (let f of files) {
        let type = f.type.split("/")[0];
        if (type != "image") continue;
        let reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = () => {
            let el = create_img(reader.result as string);
            imgs_el.append(el);
        };
    }
};

document.getElementById("run").onclick = () => {
    run_ocr();
};
document.getElementById("close").onclick = () => {
    output_el.value = "";
    output = [];
    imgs_el.innerHTML = "";
};

/** 拖放数据处理 */
function put_datatransfer(data: DataTransfer) {
    if (data.files.length != 0) {
        for (let f of data.files) {
            let type = f.type.split("/")[0];
            if (type != "image") continue;
            let reader = new FileReader();
            reader.readAsDataURL(f);
            reader.onload = () => {
                let el = create_img(reader.result as string);
                imgs_el.append(el);
            };
        }
    } else {
    }
}

function create_img(src: string) {
    let div = document.createElement("div");
    div.classList.add("img_el");
    let image = document.createElement("img");
    image.src = src;
    div.append(image);
    return div;
}

function run_ocr() {
    output_el.value = "";
    output = [];
    imgs_el.querySelectorAll(":scope > div > div").forEach((el: HTMLElement) => {
        el.innerHTML = "";
    });
    imgs_el.querySelectorAll(":scope > div > img").forEach((el: HTMLImageElement, i) => {
        to_text(el, i);
    });
}

function to_text(img: HTMLImageElement | HTMLCanvasElement, i: number) {
    let canvas = document.createElement("canvas");
    let w = img.width,
        h = img.height;
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(img, 0, 0);
    ocr.ocr(canvas.getContext("2d").getImageData(0, 0, w, h)).then((v) => {
        let tl = [];
        let div = document.createElement("div");
        for (let i of v) {
            if (!i.text) continue;
            tl.push(i.text);
            let x0 = i.box[0][0];
            let y0 = i.box[0][1];
            let x1 = i.box[2][0];
            let y1 = i.box[2][1];
            let xel = document.createElement("p");
            xel.style.left = `${(x0 / w) * 100}%`;
            xel.style.top = `${(y0 / h) * 100}%`;
            xel.style.width = `${((x1 - x0) / w) * 100}%`;
            xel.style.height = `${((y1 - y0) / h) * 100}%`;
            div.append(xel);
            xel.innerText = i.text;
        }
        img.parentElement.append(div);
        console.log(tl);
        output[i] = tl.join("\n");
        output_el.value = output.join("\n");
    });
}

import ocr from "../../ai/ocr";

start();

import dic from "../../public/ocr/ppocr_keys_v1.txt?raw";

async function start() {
    await ocr.init({
        det_path: "./ocr/ppocr_det.onnx",
        rec_path: "./ocr/ppocr_rec.onnx",
        dic: dic,
        dev: false,
        node: true,
    });
}

let output = [];
