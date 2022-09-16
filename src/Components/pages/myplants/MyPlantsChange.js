import {useParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import axios from "axios";


const MyPlantsChange = () => {
  const {myPlantsId} = useParams();
  // 게시판 제목, 내용, 사진
  const [name, setName] = useState("");
//   const [content, setContent] = useState("");
  const [image, setImage] = useState({
    image_file: "",
    preview_URL: ""});

    let inputRef;

    const saveImage = (e) => {
      e.preventDefault();
      const fileReader = new FileReader();
      if (e.target.files[0]) {
        fileReader.readAsDataURL(e.target.files[0]);
      }
      fileReader.onload = () => {
        setImage({
          image_file: e.target.files[0],
          preview_URL: fileReader.result,
        })
      };
    };

  useEffect(() => {
    const getBoard = async () => {
      axios.defaults.headers.common['accessToken'] = `Bearer ${localStorage.getItem("access")}`;
      const {data} = await axios.get(`/api/v1/my-plants/${myPlantsId}/detail`);
      return data;
    }
    getBoard().then((result) => {
      console.log(result)
      setName(result.name);
    //   setContent(result.content);
      // 이미지는 파일을 불러올 필요가 없이 미리보기 url만 가져온다.
      // 이미지를 선택하지 않고 올리면 db에 저장되어 있는 이미지를 그대로 사용!
      setImage({...image, preview_URL: result.img })
      console.log(result.img)
      console.log(image)
    });
  }, [])

  const canSubmit = useCallback(() => {
    return name !== "" ;
  }, [image, name]);

  const handleSubmit = useCallback(async () => {
    try {

      const formData = new FormData();
      
      const data = {
        name: name,
        // content: content
      }
      const json = JSON.stringify(data)
      const blob = new Blob([json], { type: "application/json" });
      formData.append("myplantsUpdateRequest", blob);

      formData.append("files", image.image_file);

      console.log(...formData)

      axios.defaults.headers.common['accessToken'] = `Bearer ${localStorage.getItem("access")}`;
      await axios.put(`/api/v1/my-plants/${myPlantsId}`, formData);
      window.alert("수정이 완료되었습니다.");

      window.location.href = `/myplantsdetail/${myPlantsId}`;
    } catch (e) {


    }

  }, [canSubmit]);

  const deleteImage = () => {
    URL.revokeObjectURL(image.preview_URL);
    setImage({
      image_file: "",
      preview_URL: "/img/default_image.png"
    })
  }

  return (
    <div style={{marginLeft: "5%", marginTop: "4%", marginRight: "5%", marginBottom: "3%"}}>
    <h1 style={{marginBottom: "5%", fontSize: "50px"}}>내 식물 수정페이지 🪴</h1>
    <form style={{width: "100%", fontSize: "26px", display: "flex"}}>
        
    <div className="img" style={{width: "50%"}}>
    <input
          type="file"
          accept="image/*"
          onChange={saveImage}
          ref={(refParam) => (inputRef = refParam)}
          style={{ display: "none" }}
        />

        <div>
          <Button
            style={{marginLeft: "11.5%", marginBottom: "2%"}}
            variant="outline-dark"
            onClick={() => inputRef.click()}
          >
            이미지 선택
          </Button><br/>
        
          <img src={image.preview_URL} style={{marginBottom: "4%", width:"50%", height:"40%", marginLeft: "11.5%" }}/>
          <Button color="error" variant="contained" onClick={deleteImage}>
            <i class="fa-solid fa-xmark"></i>
          </Button>
        </div>
      </div>

      <div className="text" style={{width: "50%", marginTop: "5%"}}>
      <div className='mb-2 mt-3'>
              식물에게 이름을 지어주세요
          <input
            style={{width: "95%", marginTop: "2%", height: "80px", fontSize: "30px", padding: "20px 20px"}}
            type={'text'}
            onChange={(e) => {setName(e.target.value);}}
            className="name"
            value={name}
          />
        </div>
      </div>
      </form>

      <div className="submitButton" style={{marginLeft: "62%", marginBottom: "5%"}}>
        {canSubmit() ? (
          <>
          <Button
            onClick={handleSubmit}
            className="success-button"
            variant="outline-success"
          >
            수정하기
          </Button>
          <Button href={`/myplantsdetail/${myPlantsId}`} variant="outline-secondary">취소하기</Button>
          </>
        ) : (
          <Button
            className="disable-button"
            variant="outlined"
            size="large"
          >
            제목과 내용을 모두 입력하세요😭
          </Button>
        )}
      </div>

  </div>


    
  );
}

export default MyPlantsChange




  