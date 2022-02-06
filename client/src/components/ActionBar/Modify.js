import React, {useState, useContext} from "react";
import { UserContext } from "../../helpers/userContext";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { customSchema } from "../../helpers/Schema/customSchema";

function Modify(data) {

  const accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const {userState} = useContext(UserContext);
  const user = userState;
  const props = data.data
  const [displayForm, setDisplayForm] = useState(false);
  const [message, setMessage] = useState(null);

  //From imported validation schema
  const validationSchema = customSchema;
  //Initial form value = old content
  const initialValues = {
    content: props.element.content
  };

  let URL = "";
  //Set url base on targeted element
  if (props.target === "article") {
    URL = process.env.REACT_APP_BASE_URL + "/article/";
  } else {
    URL = process.env.REACT_APP_BASE_URL + "/comment/";
  };

  const onSubmit = (data) => {
    //Set data to send
    const payload = {
      ...data,
      id: user.id
    };

    axios.put(URL + props.element.id, payload, { headers : { 'x-access-token': accessToken } })
      .then((response) => {
        //Close form and initiate refresh
        console.log(response.data.message);
        toggleForm();
        props.func();

      }).catch((error) => {
        //Or set error message to display
        setMessage(error.response.data.message);
      });
  };
  //Manage form display
  function toggleForm() {
    setDisplayForm(!displayForm);
  };
  
  return (
    <>
      {message && (
        <span className="error_response">{message}</span>
      )}
      {displayForm ? (
        <>
          <button className="popup_form_closebtn" onClick={toggleForm}>
            Close form
          </button>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form className="popup_form">
              <button className="base_form_closebtn" onClick={toggleForm}>
                Close form
              </button>
              <h3>Modify your story</h3>
              <label htmlFor="content">Content : </label>
              <Field
                as="textarea"
                aria-label="votre histoire"
                id="content"
                name="content"
                placeholder="My story"
                autoComplete="off"
              />
              <br />
              <ErrorMessage name="content" component="span" className="form_error"/>
              <br />
              <br />
              <button
                className="base_form_button"
                type="submit"
                aria-label="valider"
              >
                Submit
              </button>
            </Form>
          </Formik>
        </> 
      ) : (
        <>
          <button className="popup_form_button" onClick={toggleForm} >
            Modify
          </button>
        </>
      )}
      
    </>
  )
}

export default Modify;