import React from "react";
import { useSelector } from "react-redux";
import { AiFillStar } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import { githubIssuesSelector } from "../../redux/slices/issuesSlice";
import Loader from "../Loader/Loader";
import IssuesContainer from "../IssuesContainer/IssuesContainer";
import { EStatus } from "../../redux/commonDeclaration";
import s from "./issues.module.scss";

const Issues = () => {
  const {
    openedIssues,
    closedIssues,
    inProgressIssues,
    repoOwner,
    repoName,
    stargazersCount,
    errorMessage,
    status,
  } = useSelector(githubIssuesSelector);

  if (status === EStatus.LOADING) {
    return <Loader />;
  }

  const isError = errorMessage !== "";
  const isRepoEmpty = repoOwner === "" && repoName === "";
  const isNoSearch = status === EStatus.NO_SEARCH;

  return (
    <>
      {isError ? (
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
          {isRepoEmpty ? (
            <></>
          ) : (
            <div className={s.repoInfo}>
              <a
                href={`https://github.com/${repoOwner}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {repoOwner && repoOwner}
              </a>{" "}
              {`>`}
              <a
                href={`https://github.com/${repoOwner}/${repoName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {repoName && repoName}
              </a>
              <span>
                <AiFillStar className={s.starIcon} />
                {stargazersCount} stars
              </span>
            </div>
          )}
          {isNoSearch ? (
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
