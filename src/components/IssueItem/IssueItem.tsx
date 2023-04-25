import React from "react";
import { IIssue } from "../../redux/commonDeclaration";
import s from "./issueItem.module.scss";

interface IIssueItemProps {
  issue: IIssue;
}

const IssueItem: React.FC<IIssueItemProps> = ({ issue }) => {
  const { id, title, number, created_at, user, comments, html_url } = issue;

  const daysAgo = Math.floor(
    (Number(new Date()) - Number(new Date(created_at))) / (1000 * 60 * 60 * 24)
  );

  return (
    <div key={id} className={s.issueItem}>
      <a href={html_url} target="_blank" rel="noopener noreferrer">
        {title ?? "title is undefined"}
      </a>
      <h4>
        {`#${number}`}
        {created_at && " opened "}
        {created_at && daysAgo}
        {created_at && " days ago "}
      </h4>
      <div className={s.userRefWrapper}>
        <a href={user?.html_url} target="_blank" rel="noopener noreferrer">
          {user?.login ?? "user is undefined"}
        </a>
        <h4>{`| Comments: ${comments ?? "undefined"}`}</h4>
      </div>
    </div>
  );
};

export default IssueItem;
