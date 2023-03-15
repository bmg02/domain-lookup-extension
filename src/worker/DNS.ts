import { CurrencyDAO, ServerRespDAO, TimezoneDAO } from "../interfaces";
import { DNS_KEY } from "../keys";
import { ERROR, LOAD_SERVER_INFO } from "../states";

export default class DNS {
	static domainIP = "";

	static cleanObject(data: ServerRespDAO) {
		const cleanEmptyField = (data: {}) => {
			for (let i in data) {
				if (!data[i]) data[i] = "NA";
			}
			return data;
		};

		if (!data.ip) data.ip = "NA";
		if (!data.isp) data.isp = "NA";
		if (!data.latitude) data.latitude = "NA";
		if (!data.longitude) data.longitude = "NA";
		if (!data.calling_code) data.calling_code = "NA";
		if (!data.languages) data.languages = "NA";
		if (!data.city) data.city = "NA";
		if (!data.district) data.district = "NA";
		if (!data.state_prov) data.state_prov = "NA";
		if (!data.country_name) data.country_name = "NA";
		if (!data.continent_name) data.continent_name = "NA";
		if (!data.zipcode) data.zipcode = "NA";
		if (!data.country_flag) data.country_flag = "NA";

		if (!data.currency) {
			data.currency = {
				code: "NA",
				name: "NA",
				symbol: "NA",
			};
		} else {
			data.currency = <CurrencyDAO>cleanEmptyField(data.currency);
			data.currency = {
				code: data.currency.code,
				name: data.currency.name,
				symbol: data.currency.symbol,
			};
		}

		if (!data.time_zone) {
			data.time_zone = {
				current_time: "NA",
				current_time_unix: "NA",
				name: "NA",
			};
		} else {
			data.time_zone = <TimezoneDAO>cleanEmptyField(data.time_zone);
			data.time_zone = {
				name: data.time_zone.name,
				current_time: data.time_zone.current_time,
				current_time_unix: data.time_zone.current_time_unix,
			};
		}
		return data;
	}
	static async prefetchDomainIP(hostname: string) {
		fetch(`https://dns.google/resolve?name=${hostname}`).then(
			async (res) => {
				const data = await res.json();
				if (
					data &&
					Array.isArray(data?.Answer) &&
					data.Answer.length &&
					data.Answer[0].name &&
					data.Answer[0].name !== "."
				) {
					DNS.domainIP = data.Answer[0].data;
				}
			}
		);
	}

	static async getInfo(port: chrome.runtime.Port) {
		if (!DNS.domainIP) {
			port.postMessage({
				status: ERROR,
				message: "Error while fetching domain IP address.",
			});
			return;
		}

		const data = await fetch(
			`https://api.ipgeolocation.io/ipgeo?apiKey=${DNS_KEY}&ip=${DNS.domainIP}`
		).then(async (res) => DNS.cleanObject(await res.json()));
		port.postMessage({
			status: LOAD_SERVER_INFO,
			data,
		});
	}
}
