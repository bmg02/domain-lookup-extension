import { Communicate } from "../interfaces";
import {
	CLOSE_EXTENSION,
	CONNECT,
	INIT_UI,
	LOAD_SERVER_INFO,
	LOAD_DOMAIN_INFO,
} from "../states";
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

		Container.init(port, () => {
			port?.postMessage({
				status: CLOSE_EXTENSION,
			});
			port = null;
		});

		port.onMessage.addListener(
			(message: Communicate, port: chrome.runtime.Port) => {
				console.log(31, message);
				switch (message.status) {
					case LOAD_DOMAIN_INFO:
						if (typeof message.data === "object")
							Container.loadWhoisInfo(message.data);
						else Container.loadError();
						break;

					case LOAD_SERVER_INFO:
						if (typeof message.data === "object")
							Container.loadServerInfo(message.data);
						else Container.loadError();
						break;

					default:
						break;
				}
			}
		);
	}
});
