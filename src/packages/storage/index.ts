import { IIssue } from "../../redux/commonDeclaration";

export const setIssuesOrder = (arr: IIssue[], key: string) => {
  const jsonString = JSON.stringify(arr);
  localStorage.setItem(key, jsonString);
};

export const getIssuesOrder = (key: string) => {
  const data = localStorage.getItem(key);
  const parsedData = data !== null ? JSON.parse(data) : null;
  console.log(parsedData);
  return parsedData !== null ? parsedData : [];
};
