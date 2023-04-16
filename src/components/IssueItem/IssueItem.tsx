import React from "react";
import { IIssue } from "../../redux/commonDeclaration";
import s from "./issueItem.module.scss";

interface IIssueItemProps {
  issue: IIssue;
}

const IssueItem: React.FC<IIssueItemProps> = ({ issue }) => {
  const { id, title, number, created_at, user, comments, html_url } = issue;

  return (
    <article key={id} className={s.issueItem}>
      <a href={html_url} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
      <h4>
        {`#${number} opened `}
        {Math.floor(
          (Number(new Date()) - Number(new Date(created_at))) /
            (1000 * 60 * 60 * 24)
        )}{" "}
        days ago
      </h4>
      <div className={s.userRefWrapper}>
        <a href={user?.html_url} target="_blank" rel="noopener noreferrer">
          {user?.login}
        </a>
        <h4>{`| Comments: ${comments}`}</h4>
      </div>
    </article>
  );
};

export default IssueItem;
