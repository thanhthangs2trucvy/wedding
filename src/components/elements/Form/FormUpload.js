import classNames from "classnames";
import React, { useState } from "react";
import { Icon } from "../Icon";
import { forEach, map } from "lodash";
import { FormHint } from "./FormHint";
let WIDTH = 450;
let HEIGHT = 450;
export const FormUpload = ({
  className,
  label,
  status,
  onEndUploadImage,
  hint,
}) => {
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState('');

  // NOTE : Function
  const handleDeleteImage = (indexItem) => {
    const filteredArray = previewImages.filter((_, index) => index !== indexItem);
    setPreviewImages(filteredArray);
    onEndUploadImage(filteredArray);
  }
  const loadFile = async (event) => {
    const files = event.target.files;
    if (!files || !files[0]) return setErrors("File upload not supported");
    if (files.length > 4) return setErrors("Upload tối đa 4 hình ảnh");
    // Create an array to store preview URLs
    const preview = [];

    for (const item of files) {
      let fileRead = await readImage(item);
      if (fileRead) {
        preview.push(fileRead);
        setErrors('');
      }
    }

    setPreviewImages(preview);
    onEndUploadImage(preview);
  };

  const readImage = async (file) => {
    if (file.size >= 10485760) {
      let textSize = `${file.name} - ${(file.size / 1048576).toFixed(2)}MB. Vui lòng chọn image có kích thước <10MB `;
      setErrors(textSize);
      return false;
    }

    if (!/^image\/(png|jpe?g|gif)$/.test(file.type)) {
      let textType = `File upload not supported ${file.type}: ${file.name}`;
      setErrors(textType);
      return false;
    }

    const res = await imageToBase64(file);
    const resized = await reduceImageFileSize(res);
    return resized;
  }

  const imageToBase64 = async (file) => {
    let result_base64 = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.onerror = (error) => {
        alert('An Error occurred please try again, File might be corrupt');
      };
      fileReader.readAsDataURL(file);
    });
    return result_base64;
  }

  const processImage = async (file, size = 300) => {
    const res = await imageToBase64(file);
    if (res) {
      const old_size = calcImageSize(res);
      if (old_size > size) {
        const resized = await reduceImageFileSize(res);
        const new_size = calcImageSize(resized)
        return new_size;
      } else {
        return res;
      }

    } else {
      return null;
    }
  }

  const calcImageSize = (file) => {
    let y = 1;
    if (file.endsWith('==')) {
      y = 2
    }
    const x_size = (file.length * (3 / 4)) - y
    return Math.round(x_size / 1024)
  }

  const reduceImageFileSize = async (base64Str, MAX_WIDTH = WIDTH, MAX_HEIGHT = HEIGHT) => {
    let resized_base64 = await new Promise((resolve) => {
      let img = new Image();
      img.src = base64Str
      img.onload = () => {
        let canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        canvas.width = width
        canvas.height = height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL()) // this will return base64 image results after resize
      }
    });
    return resized_base64;
  }

  // NOTE : ClassName
  const classes = classNames(
    'form-upload',
    status && `form-${status}`,
    className
  );
  // NOTE : RN
  return (
    <>
      <div className={classes}>
        <h6>{label}</h6>
        <div className="form-upload-inner">
          <div className="form-upload-inner__copy">
            <div className="form-upload-inner__image">
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 48 48"><g fill="none"><path fill="#000" d="M44 24C44 22.8954 43.1046 22 42 22C40.8954 22 40 22.8954 40 24H44ZM24 8C25.1046 8 26 7.10457 26 6C26 4.89543 25.1046 4 24 4V8ZM39 40H9V44H39V40ZM8 39V9H4V39H8ZM40 24V39H44V24H40ZM9 8H24V4H9V8ZM9 40C8.44772 40 8 39.5523 8 39H4C4 41.7614 6.23857 44 9 44V40ZM39 44C41.7614 44 44 41.7614 44 39H40C40 39.5523 39.5523 40 39 40V44ZM8 9C8 8.44772 8.44771 8 9 8V4C6.23858 4 4 6.23857 4 9H8Z" /><path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 35L16.6931 25.198C17.4389 24.5143 18.5779 24.4953 19.3461 25.1538L32 36" /><path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M28 31L32.7735 26.2265C33.4772 25.5228 34.5914 25.4436 35.3877 26.0408L42 31" /><path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M37 18L37 6" /><path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M32 11L37 6L42 11" /></g></svg>
            </div>
            <p className="form-upload-inner__text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
            <p className="form-upload-inner__hint">Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu công ty hoặc các tập tin bị cấm khác.</p>
          </div>
          <input className="form-input-file-input" type="file" id="upload-file" accept="image/*" multiple onChange={loadFile} name="files" />
        </div>
        {errors && <FormHint status='error' >{errors}</FormHint>}
        {hint && <FormHint status={status} >{hint}</FormHint>}
        <div className="form-upload-display">
          {
            map(previewImages, function (url, index) {
              return (
                <div key={index} className="form-upload-display__item">
                  <div onClick={() => handleDeleteImage(index)} className="form-upload-display__delete">
                    <Icon name='close' />
                  </div>
                  <div className="form-upload-display__image">
                    <img src={url} alt={`Image ${index}`} />
                  </div>
                </div>
              )
            })
          }
        </div>

      </div>

    </>
  )
}

// <input className="form-input-file" type="file" accept="image/*" onChange={handleImageChange} />

// {
//   previewImages && (
//     <div className="image-preview">
//       {previewImages.map((url, index) => (
//         <img key={index} src={url} alt={`Image ${index}`} />
//       ))}
//     </div>
//   )
// }
