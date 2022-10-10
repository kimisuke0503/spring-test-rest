import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { EmployeeType } from "./EmployeeType";

function App() {
  const [info, setInfo] = useState<EmployeeType[]>([]);
  const employeeDatas: EmployeeType[] = [];
  const springServerEmployees = "http://localhost:8080/employees";

  const ShowEmployeeDatas = (props: { info: EmployeeType[] }) => {
    return (
      <div className="grid">
        {props.info.map((d, index) => (
          <div key={index}>
            <p>Id: {d.employeeId}</p>
            <p>Name: {d.employeeName}</p>
            <p>Role: {d.employeeRole}</p>
          </div>
        ))}
      </div>
    );
  };

  const getEmployeeData = () => {
    axios
      .get(springServerEmployees)
      .then((res) => {
        res.data._embedded.employeeList.forEach(
          (resData: { [x: string]: any }, index: number) => {
            const data: EmployeeType = {
              employeeId: resData["id"],
              employeeName: resData["name"],
              employeeRole: resData["role"],
            };
            employeeDatas.push(data);
          }
        );
        setInfo(employeeDatas);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // インターフェース
  interface PostData {
    name: string;
    role: string;
  }

  // 初期データ
  const initialPostData: PostData = {
    name: "",
    role: "",
  };

  const [postData, setPostData] = useState<PostData>(initialPostData);

  // onChange で取得
  const onChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPostData({ ...postData, name: value });
  };
  const onChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPostData({ ...postData, role: value });
  };

  const handleSubmit = () => {
    axios.post(springServerEmployees, postData).catch((error) => {
      console.log(error);
    });
  };

  const [deleteId, setDeleteId] = useState<string>("");
  const handleDelete = () => {
    axios
      .delete(springServerEmployees + "/" + deleteId)
      .then(() => {
        alert("Id:" + deleteId + " deleted");
        setDeleteId("");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="App">
      <h1>Spring Test</h1>
      <div className="item">
        <h2>Get</h2>
        <button onClick={getEmployeeData}>Get Current Data</button>
        {info[0] ? <ShowEmployeeDatas info={info} /> : <div></div>}
      </div>

      <div className="item">
        <h2>Post</h2>
        <form>
          <label>
            Name:
            <input
              name="userName"
              value={postData.name}
              onChange={onChangeUserName}
            />
            <br />
            Role:
            <input name="role" value={postData.role} onChange={onChangeRole} />
          </label>
          <br />
          <button onClick={handleSubmit}>Post Data</button>
          <div>{postData.name}</div>
          <div>{postData.role}</div>
        </form>
      </div>

      <div className="item">
        <h2>Delete</h2>
        <label>
          Id:
          <input
            name="id"
            value={deleteId}
            onChange={(e) => {
              setDeleteId(e.target.value);
            }}
          />
          <br />
          <div>{deleteId}</div>
          <button onClick={handleDelete}>Delete Data</button>
        </label>
      </div>
    </div>
  );
}

export default App;
