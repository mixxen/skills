import http from "node:http";
import { handle } from "./app.js";

http.createServer(handle).listen(Number(process.env.PORT || 3000));
