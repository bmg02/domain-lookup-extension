import { AddressDAO, RegistrarDAO, WhoisRespDAO } from "../interfaces";
import { WHOIS_KEY } from "../keys";
import { LOAD_DOMAIN_INFO } from "../states";

export default class Whois {
	static getEmptyAddress() {
		return {
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
		};
	}

	static cleanObject(data: WhoisRespDAO) {
		const cleanEmptyField = (data: {}) => {
			for (let i in data) {
				if (!data[i]) data[i] = "NA";
			}
			return data;
		};

		data.admin = <AddressDAO>(
			(!data.admin
				? Whois.getEmptyAddress()
				: cleanEmptyField(data.admin))
		);
		data.billing = <AddressDAO>(
			(!data.billing
				? Whois.getEmptyAddress()
				: cleanEmptyField(data.billing))
		);
		if (!data.create_date) data.create_date = "NA";
		if (!data.domain) data.domain = "NA";
		if (!data.domain_age) data.domain_age = 0;
		if (!data.domain_id) data.domain_id = "NA";
		if (!data.expire_date) data.expire_date = "NA";
		if (!data.nameservers) data.nameservers = [];
		data.registrant = <AddressDAO>(
			(!data.registrant
				? Whois.getEmptyAddress()
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
			(!data.tech ? Whois.getEmptyAddress() : cleanEmptyField(data.tech))
		);
		if (!data.update_date) data.update_date = "NA";
		if (!data.whois_server) data.whois_server = "NA";
		return data;
	}

	static async getInfo(port: chrome.runtime.Port, hostname: string) {
		const data = await fetch(
			`https://api.ip2whois.com/v2?key=${WHOIS_KEY}&domain=${hostname}`
		).then(async (res) => Whois.cleanObject(await res.json()));
		port.postMessage({
			status: LOAD_DOMAIN_INFO,
			data,
		});
	}
}
