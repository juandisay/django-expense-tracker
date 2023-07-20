import "./App.css";

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Charts from "./pages/Charts/Charts";

import Navbar from "./components/Navbar/Navbar";
import UserGreet from "./components/UserGreet/UserGreet";
import CustomForm from "./components/CustomForm/CustomForm";

function App() {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );

  const createExpenseFormFields = [
    "amount",
    "content",
    "category",
    "date",
    "source",
  ];

  if (!accessToken) {
    return <Login setAccessToken={setAccessToken} />;
  }

  return (
    <Router>
      <div className='App'>
        {" "}
        <Navbar RouterLink={Link} />
        <UserGreet />
        {/* {% block content %} {% endblock content %} */}
        <div className='container' data-test='container'>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/charts' element={<Charts />} />
            <Route
              path='/create'
              element={
                <CustomForm
                  title={"Create Expense:"}
                  formFields={createExpenseFormFields}
                  cancelBtn={true}
                />
              }
            />
            <Route
              path='/update'
              element={
                <CustomForm
                  title={"Update Expense:"}
                  formFields={createExpenseFormFields}
                  submitBtnText={"Save changes"}
                  cancelBtn={true}
                />
              }
            />

            <Route
              path='/delete'
              element={
                <CustomForm
                  title={"Delete Expense:"}
                  formText='Are you sure you want to delete this item?'
                  submitBtnText={"Yes"}
                  submitBtnColor={"danger"}
                  cancelBtn={true}
                />
              }
            />

            <Route
              path='/create-budget'
              element={
                <CustomForm
                  title='Create Budget:'
                  formFields={["amount"]}
                  cancelBtn={true}
                />
              }
            />

            <Route
              path='/update-budget'
              element={
                <CustomForm
                  title='Update Budget:'
                  formFields={["amount"]}
                  submitBtnText={"Save changes"}
                  cancelBtn={true}
                />
              }
            />

            <Route
              path='/delete-budget'
              element={
                <CustomForm
                  title={"Delete Budget:"}
                  formText='Are you sure you want to delete this item?'
                  submitBtnText={"Yes"}
                  submitBtnColor={"danger"}
                  cancelBtn={true}
                />
              }
            />

            <Route path='/login' element={<Login />} />

            <Route
              path='/signup'
              element={
                <CustomForm
                  title='Sign up:'
                  formFields={["Username", "Password", "Password confirmation"]}
                  submitBtnText={"Sign up"}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
