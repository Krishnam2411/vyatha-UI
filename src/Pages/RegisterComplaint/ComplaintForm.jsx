/* eslint-disable no-console */
import { useState, useEffect, useContext, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import FileBase64 from "react-file-base64";
import styles from "./ComplaintForm.module.scss";
import { UserContext } from "../../Context/Provider";
import Captcha from "../../Components/Shared/CaptchaComponent/Captcha";
// import Captcha from '../../Components/Shared/CaptchaComponent/Captcha'

const ComplaintForm = () => {
  useEffect(() => {
    document.title = "Complaint Form | Vyatha";
  }, []);

  const navigate = useNavigate();
  const { isLoggedIn, role, profile, captchaVerified } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/auth/login");
    }

    if (role !== "student") {
      navigate("/dashboard");
    }

    if (profile?.user?.isVerified === false) {
      toast("you must verify your email first");
      navigate("/dashboard");
    }

    if (profile?.user?.idcard === "") {
      toast("you must upload your id card first");
      navigate("/dashboard");
    }

    if (profile?.user?.designation !== "Student") {
      toast("Only students can file an issue");
      navigate("/dashboard");
    }
  }, [
    isLoggedIn,
    navigate,
    profile?.user?.designation,
    role,
    profile?.user?.isVerified,
    profile?.user?.idcard,
  ]);
  const [formData, setFormData] = useState({
    category: "LAN",
    description: "",
    title: "",
  });
  const [photo, setPhoto] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleImgChange = (base64) => {
    setPhoto(base64);
    setImagePreview(base64);
  };

  const handleInput = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  function handleDragOver(e) {
    // console.log("dragover");
    e.preventDefault();
  }

  function handleDrop(e) {
    // console.log('drop');
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      const { name } = file;
      setFormData({
        ...formData,
        photo: name,
      });
    }
  }

  const token = Cookies.get("authToken");
  const handleIssueSubmit = async (e) => {
    e.preventDefault();

    if (captchaVerified === false) {
      toast("Verify Captcha first");
      return;
    }
    setCheck(true);
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await axios
        .post(
          `${import.meta.env.VITE_REACT_APP_API}/createissue`,
          {
            description: formData.description,
            category: formData.category,
            title: formData.title,
            photo,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.message === "Issue registered successfully") {
            toast("Complaint Registered Successfully");
            navigate("/dashboard");
            window.location.reload();
            setFormData({
              category: "",
              description: "",
              title: "",
            });
            setPhoto("");
          }
        });
    } catch (err) {
      if (err.response) {
        switch (err.response.data.error) {
          case "You must verify your email to submit an issue":
            toast("You must verify your email to submit an issue");
            break;
          case "Please provide title, description and photo":
            toast("Please provide title, description, category and photo");
            break;
          case "Only student can file an issue":
            toast("Only student can file an issue");
            break;
          case "Something went wrong on the server side":
            toast("Something went wrong on the server side");
            break;
          default:
            toast("Something went wrong");
            break;
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const [check, setCheck] = useState(false);
  const [errors, setErrors] = useState({});
  const [validTitle, setValidTitle] = useState(false);
  const [validDesc, setValidDesc] = useState(false);

  const validateTitle = useCallback(() => {
    const title = document.getElementById("title")?.value;
    if (title.length === 0) {
      setValidTitle(false);
      setErrors((prev) => ({
        ...prev,
        title: "Title is required",
      }));
    } else setValidTitle(true);
  }, []);

  const validateDesc = useCallback(() => {
    const description = document.getElementById("description")?.value;
    if (description.length === 0) {
      setValidDesc(false);
      setErrors((prev) => ({
        ...prev,
        desc: "Description is required",
      }));
    } else setValidDesc(true);
  }, []);

  const validateForm = useCallback(() => {
    validateTitle();
    validateDesc();
    return validTitle && validDesc;
  }, [validTitle, validDesc, validateDesc, validateTitle]);

  return (
    <div className={styles.ComplaintForm}>
      <div className={styles.Title}>Complaint form</div>

      <div className={styles.CForm}>
        <form className={styles.ComplaintForm}>
          <div
            className={`${styles.form_group} ${
              check && !validTitle ? styles.error : null
            }`}
          >
            <input
              type="text"
              id="title"
              value={formData.title}
              name="Title"
              onChange={(e) => {
                handleInput(e);
                validateTitle();
              }}
              required
            />
            <label htmlFor="title">Title of the Issue</label>
            <span>{errors.title}</span>
          </div>
          <div
            className={`${styles.form_group} ${
              check && !validDesc ? styles.error : null
            }`}
          >
            <textarea
              type="text"
              id="description"
              value={formData.description}
              name="description"
              onChange={(e) => {
                handleInput(e);
                validateDesc();
              }}
              autoComplete="off"
              rows="5"
              cols="40"
              required
            />
            <label htmlFor="description">Description of the Issue</label>
            <span>{errors.desc}</span>
          </div>
          <div className={styles.form_group}>
            <select
              value={formData.category}
              id="category"
              onChange={handleInput}
              style={{ cursor: "pointer" }}
            >
              <option value="" id="category" name="Category">
                LAN
              </option>
              <option id="category" name="Category">
                Electricity
              </option>
              <option id="category" name="Category">
                Water Issue
              </option>
              <option id="category" name="Category">
                Roommate issue
              </option>
            </select>
            <label htmlFor="category">Category</label>
          </div>
          {/* <div  className={styles.Uploadyourphoto}>
          <p>Upload Your Photo</p>
            </div> */}
          <div className={styles.photoUpload}>
            {/* <p>Upload Your Photo</p> */}
            <div className={styles.twodiv1}>
              <div className={styles.Uploadyourphoto}>
                <div>Upload Your Photo</div>
              </div>
              <div
                // className={styles.photoupload_inner}
                className={`${styles.photoupload_inner} ${
                  imagePreview === null ? styles.fullSize : styles.fixedImageArea
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* <p>Upload Your Photo</p> */}
                <img
                  src="https://res.cloudinary.com/dlx4meooj/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1694535132/UC%20VYATHA/Frame_58066_1_nnkr62.jpg?_s=public-apps"
                  alt=""
                  draggable="true"
                  onDragStart={(e) => e.preventDefault()}
                />
                <div className={styles.photouploadcontent}>
                  <span className={styles.Dragdrop}>Drag and Drop File</span>
                  <span className={styles.or}>-OR-</span>
                </div>

                <label
                  id="Browsebutton"
                  style={imagePreview ? { width: "150px", height: "50px" } : {}}
                >
                  BROWSE
                  {/* <input
                  type="file"
                  name="Imagefile"
                  id="imagebrowse"
                  
                /> */}
                  <FileBase64
                    id="imagebrowse"
                    multiple={false}
                    onDone={({ base64, file }) => {
                      if (
                        (file.type === "image/png" ||
                          file.type === "image/jpeg" ||
                          file.type === "image/jpg" ||
                          file.type === "image/webp" ||
                          file.type === "image/avif") &&
                        file.size <= 300 * 1024
                      ) {
                        handleImgChange(base64);
                      } else {
                        toast("Invalid file type or image is greater than 300KB");
                        setPhoto("");
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {imagePreview && (
              <div className={styles.imagePreview}>
                {/* <p>Image Preview:</p> */}
                <img style={{ pointerEvents: "none" }} src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div style={{ width: "20rem" }}>{captchaVerified === false && <Captcha />}</div>

          <div style={{ marginTop: "2vw" }} className={styles.captcha}>
            <button
              className={styles.button}
              disabled={submitting}
              style={{
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? "0.5" : "1",
                marginTop: "2vw",
              }}
              onClick={handleIssueSubmit}
              type="submit"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ComplaintForm;
