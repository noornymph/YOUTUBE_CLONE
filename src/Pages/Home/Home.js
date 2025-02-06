import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Videos from "../../components/Videos/Videos";
import { authenticate, loadClient, mostPopularVideos } from "../../api/youtube";
import { gapi } from "gapi-script";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Loader/Loader";

const Home = () => {
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2
        .init({
          client_id:
            "770521715637-qrtiaa7g0tcae4lr9nqogm1euf6i7nbi.apps.googleusercontent.com",
        })
        .then(() => {
          console.log("Google Auth initialized");
        })
        .catch((error) => {
          console.error("Error initializing Google Auth:", error);
        });
    });
  }, []);

  const handleSignIn = () => {
    authenticate()
      .then(() => {
        loadClient().then(() => {
          mostPopularVideos().then((response) => {
            setVideos(response.result.items);
          });
        });
      })
      .catch((error) => {
        console.error("Error signing in", error);
      });
  };

  return (
    <div className={`${styles.navBar}`}>
      <Layout setVideos={setVideos} />
      {videos === null ? (
        <Loader />
      ) : (
        <div
          className={`${styles.positionBody} ${styles.videoBody}`}
          id="returnedVideos"
        >
          <Videos videoList={videos} />
        </div>
      )}
      {/* Button to trigger the sign-in */}
      <button onClick={handleSignIn}>Sign In with Google</button>
    </div>
  );
};

export default Home;
