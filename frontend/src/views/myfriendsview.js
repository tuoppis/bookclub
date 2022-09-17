import { useState } from "react";
import { useApp } from "../models/appcontext.js";
import { useLogin } from "../models/logincontext.js";
import { confirmAction } from "../util/misc.js";
import { Box, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from "@mui/material";
import UserList from "../components/userlist.js";

export default function MyFriendsView() {
  const [app] = useApp();
  const user = useLogin();
  const [mode, setMode] = useState("");
  const handleClick = async (us) => {
    if (!us) return;
    let message;
    if (!mode) {
      message = await confirmAction(
        `Do you wanto to remove ${us.username} from friends?`,
        async () => user.delete(app.friendsUrl, us),
        `${us.username} removed!`,
        `Could not remove ${us.username}`
      );
    } else {
      message = await confirmAction(
        `Do you want to add ${us.username} as a friend?`,
        async () => user.post(app.friendsUrl, us),
        `${us.username} added to friends!`,
        `Could not add ${us.username} as a friend!`
      );
      if (message) {
        alert(message);
      }
    }
  };
  const handleChange = (e) => setMode(e.target.value);
  return (
    <Box>
      <FormControl>
        <FormLabel>Friends</FormLabel>
        <RadioGroup row name="friend-radio-group" value={mode} onChange={handleChange}>
          <FormControlLabel value="" control={<Radio />} label="Current" />
          <FormControlLabel value="/suggested" control={<Radio />} label="Suggested" />
          <FormControlLabel value="/available" control={<Radio />} label="Available" />
        </RadioGroup>
      </FormControl>
      <UserList url={app.friendsUrl + mode} onClick={handleClick} actions={null} />
    </Box>
  );
}
