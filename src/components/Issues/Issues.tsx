import React from "react";
import { useSelector } from "react-redux";
import { AiFillStar } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import { githubIssuesSelector } from "../../redux/slices/issuesSlice";
import Loader from "../Loader/Loader";
import IssuesContainer from "../IssuesContainer/IssuesContainer";
import { EStatus } from "../../redux/commonDeclaration";
import s from "./issues.module.scss";

// I didn't know what you wanted to receive in "In Progress Issues"
// so here it works correctly when an issue has the label "In progress",
// for better experience you can use my repo "https://github.com/ianvv/lyric-finder" with random issues

const Issues = () => {
  const {
    openedIssues,
    closedIssues,
    inProgressIssues,
    repoOwner,
    repoName,
    issuesCount,
    stargazersCount,
    errorMessage,
    status,
  } = useSelector(githubIssuesSelector);

  if (status === EStatus.LOADING) {
    return <Loader />;
  }

  return (
    <>
      {errorMessage !== "" ? (
        <div className={s.errorWrapper}>
          <h2>
            {errorMessage === "Request failed with status code 404"
              ? "There is no such repository"
              : errorMessage}{" "}
            <span>
              <BiError size={20} />
            </span>
          </h2>
        </div>
      ) : (
        <div>
          {repoOwner === "" && repoName === "" ? null : (
            <div className={s.repoInfo}>
              <a
                href={`https://github.com/${repoOwner}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {repoOwner}
              </a>{" "}
              {`>`}
              <a
                href={`https://github.com/${repoOwner}/${repoName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {repoName}
              </a>
              <span>
                {<AiFillStar className={s.starIcon} />}
                {stargazersCount} stars
              </span>
            </div>
          )}
          {issuesCount === null ? (
            <div>Enter the gitHub repository to find out about issues...</div>
          ) : (
            <div className={s.issuesWrapper}>
              <IssuesContainer arr={openedIssues} title="ToDo" />
              <IssuesContainer arr={inProgressIssues} title="In Progress" />
              <IssuesContainer arr={closedIssues} title="Done" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Issues;
