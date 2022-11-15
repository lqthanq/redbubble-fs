import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";

/**
 *  を表示するコンポーネントです。
 * @param {*} props
 * @returns
 */
const Presententer = (props) => {
  return (
    <TextField
      fullWidth
      placeholder="フリーワード検索"
      
      type="text"
      variant="outlined"
      value={props.value}
      size="small"
      onChange={(e) => props.onChange(e)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              aria-label="search"
              size="small"
              //onClick={}
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
export default Presententer;
