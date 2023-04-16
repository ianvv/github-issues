import React from "react";
import { useSelector } from "react-redux";
import { AiFillStar } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import IssueItem from "../IssueItem/IssueItem";
import { githubIssuesSelector } from "../../redux/slices/issuesSlice";
import s from "./issues.module.scss";
import { EStatus } from "../../redux/commonDeclaration";
import Loader from "../Loader/Loader";

// I didn't know what you wanted to receive in "In Progress Issues"
// so here it works correctly when an issue has the label "In progress",
// for better experience you can use my repo "https://github.com/ianvv/lyric-finder" with random issues

// Also, I have decided to not use UI libraries cuz I wrote
// my own components and didn't see any sense to insert instead
// of them UI components but of course using them isn't a problem

const Issues: React.FC = () => {
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
              <div className={s.issuesContainer}>
                <h2>ToDo</h2>
                {
                  <ul>
                    {openedIssues.length < 1 ? (
                      <h3>No issues yet...</h3>
                    ) : (
                      openedIssues.map((issue) => (
                        <IssueItem key={issue.id} issue={{ ...issue }} />
                      ))
                    )}
                  </ul>
                }
              </div>
              <div className={s.issuesContainer}>
                <h2>In Progress</h2>
                <ul>
                  {inProgressIssues.length < 1 ? (
                    <h3 className={s.noIssuesMessage}>No issues yet...</h3>
                  ) : (
                    inProgressIssues.map((issue) => (
                      <IssueItem key={issue.id} issue={{ ...issue }} />
                    ))
                  )}
                </ul>
              </div>
              <div className={s.issuesContainer}>
                <h2>Done</h2>
                <ul>
                  {closedIssues.length < 1 ? (
                    <h3>No issues yet...</h3>
                  ) : (
                    closedIssues.map((issue) => (
                      <IssueItem key={issue.id} issue={{ ...issue }} />
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Issues;
