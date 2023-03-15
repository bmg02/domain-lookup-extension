import { Communicate } from "../interfaces";
import {
	CLOSE_EXTENSION,
	CONNECT,
	FETCH_SERVER_INFO,
	FETCH_DOMAIN_INFO,
	INIT_UI,
} from "../states";
import DNS from "./DNS";
import Whois from "./Whois";

chrome.action.disable();
chrome.tabs.onUpdated.addListener(
	(
		tabId: number,
		changeInfo: chrome.tabs.TabChangeInfo,
		tab: chrome.tabs.Tab
	) => {
		if (changeInfo.status === "complete") {
			chrome.action.enable();
		}
	}
);

chrome.action.onClicked.addListener(({ id }) => {
	if (id) {
		chrome.tabs.sendMessage(id, {
			status: INIT_UI,
		});
	}
});

chrome.runtime.onConnect.addListener(async (port: chrome.runtime.Port) => {
	if (port.name === CONNECT) {
		port.onMessage.addListener(
			(message: Communicate, port: chrome.runtime.Port) => {
				switch (message.status) {
					case FETCH_DOMAIN_INFO:
						Whois.getInfo(port, message.data?.hostname);
						DNS.prefetchDomainIP(message.data?.hostname);
						break;
					case FETCH_SERVER_INFO:
						DNS.getInfo(port);
						break;
					case CLOSE_EXTENSION:
						port.disconnect();
						break;
					default:
						break;
				}
				return true;
			}
		);
	}
});
