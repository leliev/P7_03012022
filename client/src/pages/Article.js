import React, {useEffect, useState, useContext} from "react";
import { UserContext } from "../helpers/userContext";
import axios from "axios";
import { useParams, useNavigate} from 'react-router-dom';
import Create from "../components/Article/Create";
import ActionBar from "../components/ActionBar";

function Article() {
  let { id } = useParams();
  const { userState } = useContext(UserContext)
  const user = userState;
  const likeData = {id: user.id};
  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const [message, setMessage] = useState(null);
  const [article, setArticle] = useState({});
  const [commentList, setCommentList] = useState([]);
  const [liked, setLiked] = useState(null);
  const [refresh, setRefresh] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {

    setMessage("");

    if (accessToken === null || !accessToken) { 
      window.location.replace("/signin")
    };

    if (user.isLogged) {
      const payload = { "element": id, "user": user.id };
      const data = JSON.stringify(payload);

      axios.get(process.env.REACT_APP_BASE_URL + `/article/${data}`, { headers : { 'x-access-token': accessToken } })
        .then((res) => {
          const likeValue = res.data.isLiked;
          setLiked(likeValue);

          const currentArticle = res.data.article;
          setArticle(currentArticle);

          const comments = currentArticle.comments;
          setCommentList(comments);

          console.log(res.data.article)
        }).catch((error) => {
          setMessage(error.response.data.message);
          navigate('/');
        });
    } else {
      navigate("/signin");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liked, refresh])

  function handleClick() {
    axios.put(process.env.REACT_APP_BASE_URL + `/like/${article.id}`, likeData, { headers : { 'x-access-token': accessToken } })
      .then((response) => {
        console.log(response.data.message);
        setLiked(!liked)
      }).catch((error) => {
        setMessage(error.response.data.message);
        console.log(error);
      });
  };

  function toggleRefresh() {
    setRefresh(!refresh);
  };

  var data = {
    element: article,
    func: toggleRefresh
  };
  return (
    <div>
      <Create func={toggleRefresh}/>
      <div className="articleCard">

        {message && (
          <span className="error_response">{message}</span>
        )}

        <div className="articleBody">
        <button id="like" onClick={handleClick} className={liked ? "base_form_closebtn" : "base_form_button"} >{liked ? "Unlike" : "Like"}</button>
          <h2>{article.title}</h2>
          <p>
            {article.content}
          </p>
        </div>

        <div className="articleFooter">

          <span>Likes : {article.like ? article.like.value : 0}</span>
    
          {article.userId ? (
            <span onClick={() => {
              navigate(`/user/${article.author}`)
            }}>
              Author : {article.author}
            </span>
          ) : (
            <span>
              Author (deleted): {article.author}
            </span>
          )}
      
          <span>Comments : {article.comments ? article.comments.length : 0 }</span>
        </div>

        <div>
          <ActionBar data={data}/>
        </div>
      </div>

      <div className="commentWrapper">
        {commentList.map((comment, key) => {
          var data = {
            element: comment,
            func: toggleRefresh
          };
          return (
            <div className="commentCard" key={key}>
              <div className="commentBody">
                <p>{comment.content}</p>
              </div>

              <div className="commentFooter">
                <span>Comment by : {comment.author}</span>
              </div>
              
              <div>
                <ActionBar data={data}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Article;