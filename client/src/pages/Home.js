import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../helpers/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Create from "../components/Article/Create";
import ActionBar from "../components/ActionBar";
import "../styles/article.css"

function Home() {
  
  const { userState } = useContext(UserContext);
  const user = userState
  const [message, setMessage] = useState(null);
  const [articleList, setArticleList] = useState([]);
  const [refresh, setRefresh] = useState(false)
  const navigate = useNavigate();


  useEffect(() => {
    //Check token if user is logged in
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
    if (accessToken === null || !accessToken) {
      //navigate to signin if not
      window.location.replace("/signin")
    };
    //Reset message on render
    setMessage("");
    //If not logged In return to signin
    if (!user.isLogged) {
      navigate("/signin");
      //Else get article list
    } else if (user.isLogged) { 
      axios.get("http://localhost:8080/api/article", { headers : { 'x-access-token': accessToken } })

        .then((res) => {
          //If list empty set message state with server response and set list empty
          if (res.data.message) {
            setMessage(res.data.message);
            setArticleList([])
            //We set the article list in the state
          } else {
            setArticleList(res.data);
          };
        }).catch((error) => {
          setMessage(error.response.data.message);
          console.log(error);
        });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[refresh]);//custom triggered

  //To toggle refresh from child
  function toggleRefresh() {
    setRefresh(!refresh);
  };

  return (
    <div>
      {message && (
        <span className="error_response">{message}</span>
      )}
      <h1>Welcome to home Page</h1>
      <p className="disclaimer">Here you can view all articles, comment them and more if you are the author !!</p>
      <p className="disclaimer">Click on an article to go to his page and like it.<br/>You can also click on article author and see more info about him !</p>
      <Create func={toggleRefresh}/>
      {articleList && (
        <div className="listWrapper">
          {articleList.map((article, key) => {

            var data = {
              element: article,
              func: toggleRefresh
            };
            return (
              <div className="articleWrapper" key={key}>
                <div className="articleContainer">
                  {article.imageUrl && (
                  <img src={article.imageUrl} alt="article representation"/>
                  )}
                  <div className="articleCard" >
                    <div className="articleBody"  onClick={() => {
                      navigate(`/article/${article.id}`)
                      }}>
                      <h2>{article.title}</h2>
                      <p>
                        {article.content}
                      </p>
                    </div>

                    <div className="articleFooter">
                      <span>Likes : {article.like.value}</span>

                      {article.userId ? (
                        <span className="author" onClick={() => {
                          navigate(`/user/${article.author}`)
                        }}>
                          Author : {article.author}
                        </span>
                      ) : (
                        <span>
                          Author (deleted): {article.author}
                        </span>
                      )}

                      <span>Comments : {article.commentCount}</span>
                    </div>
                  </div>
                </div>
                <div>
                <ActionBar data={data} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
export default Home;