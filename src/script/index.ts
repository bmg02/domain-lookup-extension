import { Communicate } from "../interfaces";
import { CLOSE_EXTENSION, CONNECT, INIT_UI, LOAD_DOMAIN_INFO } from "../states";
import Container from "./Container";

let port: chrome.runtime.Port | null = null;

chrome.runtime.onMessage.addListener((message: Communicate, _, resp: any) => {
	console.log(7, message, port);
	if (message.status === INIT_UI) {
		if (!port) {
			port = chrome.runtime.connect({
				name: CONNECT,
			});
		}

		Container.init(() => {
			port?.postMessage({
				status: CLOSE_EXTENSION,
			});
			port = null;
		});

		port.onMessage.addListener(
			(message: Communicate, port: chrome.runtime.Port) => {
				console.log(31, message);
				if (message.status === LOAD_DOMAIN_INFO) {
					if (typeof message.data === "object")
						Container.loadData(message.data);
					else Container.loadError();
				}
			}
		);
	}
});
