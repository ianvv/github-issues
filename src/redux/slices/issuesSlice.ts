import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { EStatus, IIssue } from "../commonDeclaration";

interface IFetchSearchedIssuesPayload {
  issues: IIssue[];
  stargazers: number;
}

interface IFetchSearchedIssuesParams {
  repoOwner: string;
  repoName: string;
}

interface IFetchSearchedIssuesPayload {
  issues: IIssue[];
  stargazers: number;
}

export const fetchSearchedIssues = createAsyncThunk<
  IFetchSearchedIssuesPayload,
  IFetchSearchedIssuesParams
>("issues/fetchSearchedIssues", async (params) => {
  const { repoOwner, repoName } = params;

  const [issuesResponse, stargazersResponse] = await Promise.all([
    axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/issues?state=all`
    ),
    axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}`),
  ]);

  const issues = issuesResponse.data;
  const stargazers = stargazersResponse.data.stargazers_count;

  return { issues, stargazers };
});

interface IGithubIssuesSliceState {
  issuesCount: null | number;
  openedIssues: IIssue[];
  closedIssues: IIssue[];
  inProgressIssues: IIssue[];
  repoOwner: string;
  repoName: string;
  searchUrl: string;
  stargazersCount: number | null;
  errorMessage: string | undefined;
  status: EStatus;
}

const initialState: IGithubIssuesSliceState = {
  issuesCount: null,
  openedIssues: [] as IIssue[],
  closedIssues: [],
  inProgressIssues: [],
  repoOwner: "",
  repoName: "",
  searchUrl: "",
  stargazersCount: null,
  errorMessage: "",
  status: EStatus.SUCCESS,
};

const githubIssuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setRepoOwner(state, action: PayloadAction<string>) {
      state.repoOwner = action.payload;
    },
    setRepoName(state, action: PayloadAction<string>) {
      state.repoName = action.payload;
    },
    setSearchUrl(state, action: PayloadAction<string>) {
      state.searchUrl = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearchedIssues.pending, (state) => {
      state.status = EStatus.LOADING;
      state.openedIssues = [];
      state.closedIssues = [];
      state.inProgressIssues = [];
    });

    builder.addCase(fetchSearchedIssues.fulfilled, (state, action) => {
      state.issuesCount = action.payload.issues.length;
      state.errorMessage = "";
      state.stargazersCount = action.payload.stargazers;

      state.openedIssues = action.payload.issues.filter(
        (obj) =>
          obj.state === "open" &&
          !obj.labels.some(
            (label) => label.name.toLowerCase() === "in progress"
          )
      );

      state.closedIssues = action.payload.issues.filter(
        (issue) => issue.state === "closed"
      );

      state.inProgressIssues = action.payload.issues.filter((issue) => {
        return issue.labels.some(
          (label) =>
            label.name.toLowerCase() === "in progress" &&
            issue.state !== "closed"
        );
      });
      state.status = EStatus.SUCCESS;
    });

    builder.addCase(fetchSearchedIssues.rejected, (state, action) => {
      state.status = EStatus.ERROR;
      state.errorMessage = action?.error.message;
      state.openedIssues = [];
      state.closedIssues = [];
      state.inProgressIssues = [];
    });
  },
});

export const githubIssuesSelector = (state: RootState) => state.issues;

export const { setRepoOwner, setRepoName, setErrorMessage } =
  githubIssuesSlice.actions;

export default githubIssuesSlice.reducer;
