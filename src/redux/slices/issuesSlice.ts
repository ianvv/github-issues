import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { EStatus, IIssue } from "../commonDeclaration";

interface IFetchSearchedIssuesParams {
  repoOwner: string;
  repoName: string;
}

interface IFetchSearchedIssuesPayload {
  inProgressIssuesData: IIssue[];
  toDoIssuesData: IIssue[];
  closedIssuesData: IIssue[];
  stargazers: number;
}

const githubApiUrl = "https://api.github.com/repos/";

export const fetchSearchedIssues = createAsyncThunk<
  IFetchSearchedIssuesPayload,
  IFetchSearchedIssuesParams
>("issues/fetchSearchedIssues", async (params) => {
  const { repoOwner, repoName } = params;

  const [inProgressIssues, toDoIssues, closedIssues, stargazersResponse] =
    await Promise.all([
      axios.get(
        `${githubApiUrl}${repoOwner}/${repoName}/issues?state=open&labels=Status%3A%20Unconfirmed`
      ),
      axios.get(
        `${githubApiUrl}${repoOwner}/${repoName}/issues?state=open&per_page=12&page=2`
      ),
      axios.get(`${githubApiUrl}${repoOwner}/${repoName}/issues?state=closed`),
      axios.get(`${githubApiUrl}${repoOwner}/${repoName}`),
    ]);

  const inProgressIssuesData = inProgressIssues.data;
  const toDoIssuesData = toDoIssues.data;
  const closedIssuesData = closedIssues.data;
  const stargazers = stargazersResponse.data.stargazers_count;

  return { inProgressIssuesData, toDoIssuesData, closedIssuesData, stargazers };
});

interface IGithubIssuesSliceState {
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
  openedIssues: [] as IIssue[],
  closedIssues: [],
  inProgressIssues: [],
  repoOwner: "",
  repoName: "",
  searchUrl: "",
  stargazersCount: null,
  errorMessage: "",
  status: EStatus.NO_SEARCH,
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
      state.errorMessage = "";
      state.stargazersCount = action.payload.stargazers;
      state.inProgressIssues = action.payload.inProgressIssuesData;
      state.openedIssues = action.payload.toDoIssuesData;
      state.closedIssues = action.payload.closedIssuesData;
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
