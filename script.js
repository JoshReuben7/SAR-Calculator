function cleanValue(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
 
  return Number(
    String(el.value)
      .replace(/,/g, "")
      .replace(/%/g, "")
      .trim()
  ) || 0;
}
 
function num(id) {
  return cleanValue(id);
}
 
function money(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}
 
function getPricingType() {
  return document.querySelector('input[name="pricingType"]:checked').value;
}
 
function calculateSAR() {
  const type = getPricingType();
 
  const annualVolume = num("annualVolume");
  const averageTicket = num("averageTicket");
  const discountRate = num("discountRate");
  const transactionFee = num("transactionFee");
  const authFee = num("authFee");
  const settlementFee = num("settlementFee");
 
  const annualVolumeAmex = num("annualVolumeAmex");
  const averageTicketAmex = num("averageTicketAmex");
  const discountRateAmex = num("discountRateAmex");
  const transactionFeeAmex = num("transactionFeeAmex");
 
  const serviceFee = num("serviceFee");
  const geniusSoftware = num("geniusSoftware");
  const interchangeFee = num("interchangeFee");
 
  const customerIntelligence = num("customerIntelligence");
  const otherMonthly = num("otherMonthly");
  const geniusHardware = num("geniusHardware");
 
  const transactions = averageTicket ? annualVolume / averageTicket : 0;
  const amexTransactions = averageTicketAmex ? annualVolumeAmex / averageTicketAmex : 0;
 
  const sar =
    (annualVolume * discountRate) +
    (annualVolumeAmex * discountRateAmex) +
    (transactions * (transactionFee + authFee)) +
    (amexTransactions * (transactionFeeAmex + authFee)) +
    (interchangeFee * (annualVolume + annualVolumeAmex)) +
    ((serviceFee + geniusSoftware + customerIntelligence + otherMonthly + geniusHardware) * 12) +
    (annualVolume * settlementFee);
 
  document.getElementById("sarResult").textContent = money(sar);
 
  document.getElementById("breakdown").innerHTML = `
    <strong>Pricing Type:</strong> ${type === "flat" ? "Flat Rate" : "Pass Through"}<br>
    <strong>SAR:</strong> ${money(sar)}
  `;
}
 
function formatVolumeInput(id) {
  const input = document.getElementById(id);
  if (!input) return;
 
  input.addEventListener("focus", function () {
    this.value = String(this.value).replace(/,/g, "");
  });
 
  input.addEventListener("blur", function () {
    const raw = String(this.value).replace(/,/g, "");
    if (raw === "" || isNaN(raw)) return;
 
    this.value = Number(raw).toLocaleString("en-US");
    calculateSAR();
  });
 
  input.addEventListener("input", calculateSAR);
}
 
document.querySelectorAll('input[name="pricingType"]').forEach(radio => {
  radio.addEventListener("change", calculateSAR);
});
 
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", calculateSAR);
});
 
formatVolumeInput("annualVolume");
formatVolumeInput("annualVolumeAmex");
 
calculateSAR();
