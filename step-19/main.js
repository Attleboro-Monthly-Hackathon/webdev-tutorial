import { greeting } from "./greeting.js";

const target = document.getElementById("msg");
target.textContent = greeting("student");
