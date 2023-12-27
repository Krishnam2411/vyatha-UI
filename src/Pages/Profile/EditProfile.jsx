import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import styles from "./EditProfile.module.scss";
import { fetchProfile } from "../../Components/ReactQuery/Fetchers/User";
import { UserContext } from "../../Context/Provider";

const EditProfile = () => {
  useEffect(() => {
    document.title = "Edit Profile | Vyatha";
  }, []);

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);

  if (!isLoggedIn) {
    navigate("/auth/login");
  }

  const { data, error, isLoading, isFetching } = useQuery("profile", fetchProfile, {
    refetchOnWindowFocus: "always",
  });

  const myProfile = data?.user;
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (
      myProfile?.role === "supervisor" ||
      myProfile?.role === "superadmin" ||
      myProfile?.role === "dsw" ||
      myProfile?.role === "warden"
    ) {
      setIsAdmin(true);
    }
  }, [myProfile?.role]);

  if (error) {
    return <div>Something went wrong!</div>;
  }

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  // const profilePic = document.getElementById("profile-pic");

  // const inputFile = document.getElementById("input-file");

  // inputFile.onchange = () => {
  //   profilePic.src = URL.createObjectURL(inputFile.files[0]);
  // };

  const handleProfileSave = async (e) => {
    e.preventDefault();

    const token = Cookies.get("authToken");
    const name = document.getElementById("name")?.value;
    const newpwd = document.getElementById("newpwd")?.value;
    const cnewpwd = document.getElementById("cnewpwd")?.value;
    const hostel = document.getElementById("hostel")?.value;
    const phone = document.getElementById("phone")?.value;
    const room = document.getElementById("room")?.value;

    try {
      await axios
        .put(
          `${import.meta.env.VITE_REACT_APP_API}/editprofile`,
          { name, newpwd, hostel, phone, cnewpwd, room },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.message === "Profile updated successfully") {
            toast("Profile updated successfully");
            navigate("/profile");
          }
        });
    } catch (err) {
      if (err.response) {
        switch (err.response.data.error) {
          case "Unauthorized":
            toast("Unauthorized");
            break;
          case "User not found":
            toast("User not found");
            break;
          case "atleast one field must be filled":
            toast("atleast one field must be filled");
            break;
          case "new password and confirm new password must be same":
            toast("new password and confirm new password must be same");
            break;
          case "password must be atleast 8 characters long":
            toast("password must be atleast 8 characters long");
            break;
          case "Something went wrong":
            toast("Something went wrong");
            break;
          default:
            toast("something went wrongF");
        }
      }
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.Profileheading}>
            <p>My Profile</p>
          </div>
          <div className={styles.profile_image}>
            <div>
              <img src={myProfile?.profilepic} alt="profileimage" id="profile-pic" />
            </div>

            <div className={styles.changeprofile}>
              <label htmlFor="input-file">Change Photo</label>
              <input
                type="file"
                accept="image/jpeg, image/png, imagejpg"
                id="input-file"
              />
            </div>
          </div>
          <div className={styles.details_section}>
            <form>
              <div className={styles.details_section}>
                <div className={styles.details_about}>
                  <div className={styles.right_section}>Name</div>
                  <div className={styles.right_section}>Password</div>
                  <div className={styles.right_section}>Confirm Password</div>
                  <div className={styles.right_section}>Hostel</div>
                  <div
                    style={{ display: isAdmin === false ? "block" : "none" }}
                    className={styles.right_section}
                  >
                    Room
                  </div>
                  <div className={styles.right_section}>Phone</div>
                </div>

                <div className={styles.details_fill}>
                  <div className={styles.left_section}>
                    <input type="text" id="name" autoComplete="off" />
                  </div>
                  <div className={styles.left_section}>
                    <input type="password" id="newpwd" autoComplete="off" />
                  </div>
                  <div className={styles.left_section}>
                    <input type="password" id="cnewpwd" autoComplete="off" />
                  </div>
                  <div className={styles.left_section}>
                    <select id="hostel" className={styles.hostel_options}>
                      <option value="">Aryabhatt PG Hostel</option>
                      <option>BH1</option>
                      <option>BH2</option>
                      <option>BH3</option>
                      <option>BH4</option>
                      <option>BH6</option>
                      <option>BH7</option>
                      <option>BH8</option>
                      <option>BH9A</option>
                      <option>BH9B</option>
                      <option>BH9C</option>
                      <option>BH9D</option>
                      <option>GH1</option>
                      <option>GH2</option>
                      <option>GH3</option>
                      <option>GH4</option>
                    </select>
                  </div>

                  <div className={styles.left_section}>
                    <input
                      style={{ display: isAdmin === false ? "block" : "none" }}
                      type="text"
                      id="room"
                      autoComplete="off"
                    />
                  </div>

                  <div className={styles.left_section}>
                    <input type="text" id="phone" autoComplete="off" />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className={styles.button_section}>
            <button
              type="button"
              aria-label="Save Profile"
              className={styles.Editprofile}
              onClick={handleProfileSave}
            >
              <div>
                <div>Save Profile</div>
              </div>
            </button>
            {/* <button
                type="button"
                aria-label="Signout"
                className={styles.Signout}
                onClick={handleSignOut}
              >
                <div>
                  <div>Sign out</div>
                </div>
              </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
