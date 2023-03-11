import {
	AddressDAO,
	Communicate,
	RegistrarDAO,
	ResponseDAO,
} from "../interfaces";
import { CLOSE_EXTENSION, CONNECT, INIT_UI, LOAD_DOMAIN_INFO } from "../states";

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

const getEmptyAddress = () => ({
	city: "NA",
	country: "NA",
	email: "NA",
	fax: "NA",
	name: "NA",
	organization: "NA",
	phone: "NA",
	region: "NA",
	street_address: "NA",
	zip_code: "NA",
});

const cleanObject = (data: ResponseDAO) => {
	const cleanEmptyField = (data: {}) => {
		for (let i in data) {
			if (!data[i]) data[i] = "NA";
		}
		return data;
	};

	data.admin = <AddressDAO>(
		(!data.admin ? getEmptyAddress() : cleanEmptyField(data.admin))
	);
	data.billing = <AddressDAO>(
		(!data.billing ? getEmptyAddress() : cleanEmptyField(data.billing))
	);
	if (!data.create_date) data.create_date = "NA";
	if (!data.domain) data.domain = "NA";
	if (!data.domain_age) data.domain_age = 0;
	if (!data.domain_id) data.domain_id = "NA";
	if (!data.expire_date) data.expire_date = "NA";
	if (!data.nameservers) data.nameservers = [];
	data.registrant = <AddressDAO>(
		(!data.registrant
			? getEmptyAddress()
			: cleanEmptyField(data.registrant))
	);
	data.registrar = <RegistrarDAO>(!data.registrar
		? {
				iana_id: "NA",
				name: "NA",
				url: "NA",
		  }
		: cleanEmptyField(data.registrar));
	if (!data.status) data.status = "NA";
	data.tech = <AddressDAO>(
		(!data.tech ? getEmptyAddress() : cleanEmptyField(data.tech))
	);
	if (!data.update_date) data.update_date = "NA";
	if (!data.whois_server) data.whois_server = "NA";
	return data;
};

chrome.runtime.onConnect.addListener(async (port: chrome.runtime.Port) => {
	if (port.name === CONNECT) {
		const data = await fetch(
			`https://api.ip2whois.com/v2?key=FAF12EA5213EF4FDB9551D470A240705&domain=bmgandhi.me`
		).then(async (res) => cleanObject(await res.json()));

		port.postMessage({
			status: LOAD_DOMAIN_INFO,
			data,
		});

		port.onMessage.addListener(
			(message: Communicate, port: chrome.runtime.Port) => {
				switch (message.status) {
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
