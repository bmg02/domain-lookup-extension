import { AddressDAO, ResponseDAO } from "../interfaces";
import "./css/style.scss";
import "./css/ui.scss";

export default class Container {
	static shadowRoot: ShadowRoot;
	static bodyElement: HTMLDivElement;

	static init(closeExtensionFunc: Function) {
		document.body.style.overflow = "hidden";
		const shadowHost = document.createElement("div");
		shadowHost.id = "whois-lookup-shadow-host";
		shadowHost.attachShadow({ mode: "open" });
		const body = document.getElementsByTagName("body")[0];
		body.appendChild(shadowHost);
		if (shadowHost.shadowRoot) Container.shadowRoot = shadowHost.shadowRoot;

		const style = document.createElement("link");
		style.rel = "stylesheet";
		style.type = "text/css";
		style.href = chrome.runtime.getURL("/bundle/main.css");
		Container.shadowRoot.appendChild(style);

		const div = document.createElement("div");
		div.id = "whois-lookup-container";
		div.classList.add(
			"overlay-container",
			"fade-entry-anime",
			"flex-layout",
			"flex-dir-col",
			"justify-space-between"
		);
		Container.shadowRoot.appendChild(div);

		const modalDiv = document.createElement("div");
		modalDiv.classList.add(
			"modal-container",
			"flex-layout",
			"flex-dir-col",
			"justify-space-between"
		);
		modalDiv.appendChild(Container.getHeaderElement());
		modalDiv.appendChild(Container.getBodyElement());
		modalDiv.appendChild(Container.getFooterElement(closeExtensionFunc));
		div.appendChild(modalDiv);
	}

	static getHeaderElement() {
		const div = document.createElement("div");
		div.classList.add(
			"modal-header",
			"flex-layout",
			"flex-dir-col",
			"row-gap-5"
		);

		const heading = document.createElement("h2");
		heading.classList.add("bold-text", "text-primary");
		heading.textContent = "Domain information";

		const domainName = document.createElement("h5");
		domainName.classList.add("text-secondary");
		domainName.textContent = window.location.hostname;

		div.append(heading, domainName);
		return div;
	}

	static getBodyElement() {
		Container.bodyElement = document.createElement("div");
		Container.bodyElement.classList.add(
			"modal-body",
			"flex-layout",
			"flex-dir-col",
			"justify-center",
			"items-center",
			"row-gap-10"
		);
		Container.bodyElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" style='stroke: var(--whois-lookup-primary-color);' stroke-linecap="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" stroke-opacity=".3" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="1.3s" values="60;0"/></path><path stroke-dasharray="15" stroke-dashoffset="15" d="M12 3C16.9706 3 21 7.02944 21 12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></g></svg>`;
		return Container.bodyElement;
	}

	static getFooterElement(closeExtensionFunc: Function) {
		const div = document.createElement("div");
		div.classList.add("modal-footer", "flex-layout", "justify-center");

		const closeButton = document.createElement("button");
		closeButton.innerHTML = "Got it";
		closeButton.onclick = () => {
			Container.shadowRoot.host.remove();
			document.body.style.overflow = "auto";
			closeExtensionFunc();
		};

		div.appendChild(closeButton);
		return div;
	}

	static getUISection(headingText: string, valueText: string) {
		const div = document.createElement("div");
		div.classList.add("section-div", "flex-layout", "flex-dir-col");

		const headingTag = document.createElement("h5");
		headingTag.classList.add("text-secondary");
		headingTag.innerHTML = headingText;

		const valueTag = document.createElement("h3");
		valueTag.classList.add("text-primary", "bold-text");
		valueTag.innerHTML = valueText;

		div.append(headingTag, valueTag);
		return div;
	}

	static getDetailsTag(title: string, data: {}) {
		const details = document.createElement("details");
		details.classList.add("detail-tag", "width-100");
		const summary = document.createElement("summary");
		summary.classList.add("bold-text", "text-secondary");
		summary.innerHTML = title;

		const dataTags = document.createElement("div");
		dataTags.classList.add(
			"flex-layout",
			"flex-wrap",
			"col-gap-10",
			"row-gap-10"
		);
		dataTags.append(
			...Object.keys(data).map((item) =>
				Container.getUISection(item, data[item])
			)
		);
		details.append(summary, dataTags);
		return details;
	}

	static combineSections(sections: Array<HTMLDivElement>) {
		const div = document.createElement("div");
		div.classList.add("flex-layout", "flex-dir-col", "width-100");
		div.append(...sections);
		return div;
	}

	static loadData(data: ResponseDAO) {
		const divRow1 = Container.combineSections([
			Container.getUISection(
				"Created on",
				new Date(data.create_date).toUTCString()
			),
			Container.getUISection(
				"Updated on",
				new Date(data.update_date).toUTCString()
			),
			Container.getUISection(
				"Expire on",
				new Date(data.expire_date).toUTCString()
			),
		]);

		const divRow2 = Container.combineSections([
			Container.getUISection("Domain ID", data.domain_id),
			Container.getUISection(
				"Domain age (days)",
				data.domain_age.toString()
			),
		]);

		const getNameserverDivs = (data: Array<string>) => {
			if (data.length)
				return data.map((item, key) =>
					Container.getUISection(`Nameserver #${key + 1}`, item)
				);
			return [];
		};

		const divRow3 = Container.combineSections([
			...getNameserverDivs(data.nameservers),
			Container.getUISection("Whois server", data.whois_server),
		]);

		const adminContainer = Container.getDetailsTag(
			"Admin details",
			data.admin
		);
		const billingContainer = Container.getDetailsTag(
			"Billing details",
			data.billing
		);
		const registrarContaienr = Container.getDetailsTag(
			"Registrar details",
			data.registrar
		);
		const techContainer = Container.getDetailsTag(
			"Tech details",
			data.tech
		);
		const registrantContainer = Container.getDetailsTag(
			"Registrant details",
			data.registrant
		);

		Container.bodyElement.innerHTML = "";
		Container.bodyElement.append(
			divRow1,
			divRow2,
			divRow3,
			adminContainer,
			billingContainer,
			registrarContaienr,
			registrantContainer,
			techContainer
		);
	}

	static loadError() {
		const textTag = document.createElement("h4");
		textTag.classList.add("text-secondary", "text-center");
		Container.bodyElement.appendChild(textTag);
	}
}
