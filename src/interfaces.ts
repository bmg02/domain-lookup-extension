export interface Communicate {
	status: string;
	data?: any;
}

export interface AddressDAO {
	city: string;
	country: string;
	email: string;
	fax: string;
	name: string;
	organization: string;
	phone: string;
	region: string;
	street_address: string;
	zip_code: string;
}

export interface RegistrarDAO {
	iana_id: string;
	name: string;
	url: string;
}

export interface WhoisRespDAO {
	admin: AddressDAO;
	billing: AddressDAO;
	create_date: string;
	domain: string;
	domain_age: number;
	domain_id: string;
	expire_date: string;
	nameservers: Array<string>;
	registrant: AddressDAO;
	registrar: RegistrarDAO;
	status: string;
	tech: AddressDAO;
	update_date: string;
	whois_server: string;
}

export interface CurrencyDAO {
	code: string;
	name: string;
	symbol: string;
}

export interface TimezoneDAO {
	name: string;
	current_time: string;
	current_time_unix: string;
}

export interface ServerRespDAO {
	ip: string;
	isp: string;
	latitude: string;
	longitude: string;
	calling_code: string;
	languages: string;
	city: string;
	district: string;
	state_prov: string;
	country_name: string;
	continent_name: string;
	zipcode: string;
	country_flag: string;
	currency: CurrencyDAO;
	time_zone: TimezoneDAO;
}
