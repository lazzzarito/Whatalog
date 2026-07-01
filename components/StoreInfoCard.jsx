"use client";

import Icon from "@/components/Icon";

export function StoreInfoItem({ icon, strong, children, href, onClick }) {
  const content = (
    <>
      <Icon name={icon} />
      <div>
        <strong>{strong}</strong>
        <p>{children}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="store-info-item" style={{ cursor: "pointer", textDecoration: "none", color: "inherit", display: "flex" }}>
        {content}
      </a>
    );
  }

  return (
    <div className="store-info-item" style={{ cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      {content}
    </div>
  );
}

export default function StoreInfoCard({ storeConfig, showHowToBuy = false, onOpenLegal }) {
  const waHref = `https://wa.me/${storeConfig.whatsappNumber?.replace(/[^0-9+]/g, "")}`;
  const locationHref = storeConfig.googleMapsUrl || `https://www.google.com/maps/search/${encodeURIComponent(storeConfig.location || "")}`;

  return (
    <>
      <StoreInfoItem icon="map-pin" strong="Location" href={locationHref}>
        {storeConfig.location}
      </StoreInfoItem>
      <StoreInfoItem icon="whatsapp" strong="WhatsApp" href={`${waHref}?text=${encodeURIComponent("Hi, I have a question about your products")}`}>
        {storeConfig.whatsappNumber}
      </StoreInfoItem>
      <StoreInfoItem icon="clock" strong="Hours" href={`${waHref}?text=${encodeURIComponent("Hi, I'd like to know your business hours")}`}>
        {storeConfig.businessHours || "Monday - Saturday, 9:00 AM — 6:00 PM"}
      </StoreInfoItem>
      <StoreInfoItem icon="truck" strong="Deliveries" href={`${waHref}?text=${encodeURIComponent("Hi, I need information about deliveries")}`}>
        {storeConfig.deliveriesInfo || "Coordinated shipping in Miami area"}
      </StoreInfoItem>

      {onOpenLegal && (
        <StoreInfoItem icon="info" strong="Legal Information" onClick={onOpenLegal}>
          Cookies, Privacy &amp; Terms
        </StoreInfoItem>
      )}

      {storeConfig.donationUrl && (
        <a href={storeConfig.donationUrl} target="_blank" rel="noopener noreferrer" className="store-info-item" style={{ cursor: "pointer", textDecoration: "none", color: "inherit", display: "flex" }}>
          <Icon name="heart-donate" />
          <div>
            <strong style={{ color: "#e74c3c" }}>Support the template</strong>
            <p>Buy me a coffee ❤️</p>
          </div>
        </a>
      )}

      {showHowToBuy && (
        <div className="store-info-howto">
          <h3>How to buy?</h3>
          <ol>
            <li>Browse the catalog and tap + to add products.</li>
            <li>Open My Cart (floating button below).</li>
            <li>Tap Confirm via WhatsApp to send us your order.</li>
          </ol>
        </div>
      )}
    </>
  );
}
