import React, { useState } from "react";
import {
  fetchSearchedIssues,
  setErrorMessage,
  setRepoName,
  setRepoOwner,
} from "../../redux/slices/issuesSlice";
import { FaSearch, FaTimes } from "react-icons/fa";
import s from "./search.module.scss";
import { useAppDispatch } from "../../redux/store";

const Search: React.FC = () => {
  const dispatch = useAppDispatch();
  const [repoUrl, setRepoUrl] = useState("");

  const handleLoadIssues = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const regex = /github\.com\/([\w-]+)\/([\w-]+)/;
    const match = repoUrl.match(regex);
    if (match) {
      if (match.length === 3) {
        dispatch(setRepoOwner(match[1]));
        dispatch(setRepoName(match[2]));
        // if () {}
        dispatch(
          fetchSearchedIssues({
            repoOwner: String(match[1]),
            repoName: String(match[2]),
          })
        );
      } else {
        dispatch(setErrorMessage("Invalid GitHub URL"));
      }
    } else {
      dispatch(setErrorMessage("Invalid GitHub URL"));
    }
  };

  const handleReset = () => {
    setRepoUrl("");
  };

  return (
    <form className={s.searchForm} onSubmit={handleLoadIssues}>
      <div className={s.searchInputWrapper}>
        <input
          type="text"
          placeholder="Enter repo URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className={s.searchInput}
        />
        {repoUrl && <FaTimes className={s.clearIcon} onClick={handleReset} />}
      </div>
      <button
        type="submit"
        className={s.searchButton}
        disabled={repoUrl === ""}
      >
        <FaSearch className={s.searchIcon} />
      </button>
    </form>
  );
};

export default Search;
