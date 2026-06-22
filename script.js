function cleanValue(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
 
  return Number(
    String(el.value).replace(/,/g, "").replace(/%/g, "").trim()
  ) || 0;
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
 
function openCalculator() {
 
    document.getElementById("homePage").classList.add("hidden");
    document.getElementById("calculatorPage").classList.remove("hidden");
 
    updatePricingFields();
    calculateSAR();
}
 
function goHome() {
 
    document.getElementById("calculatorPage").classList.add("hidden");
    document.getElementById("homePage").classList.remove("hidden");
 
    window.scrollTo(0, 0);
}
 
function showInProduction() {
 
    document.getElementById("productionMsg").innerHTML =
        "This product is currently in production and not yet available.";
 
    document.getElementById("homePage").classList.remove("hidden");
    document.getElementById("calculatorPage").classList.add("hidden");
}
 
function updatePricingFields() {
  const type = getPricingType();
 
  document.querySelectorAll(".pass-field").forEach(field => {
    field.classList.toggle("disabled-field", type === "flat");
  });
 
  calculateSAR();
}
 
function calculateSAR() {
  const type = getPricingType();
 
  const annualVolume = cleanValue("annualVolume");
  const averageTicket = cleanValue("averageTicket");
  const discountRate = cleanValue("discountRate");
 
  const authFee = cleanValue("authFee");
  const annualVolumeAmex = cleanValue("annualVolumeAmex");
  const averageTicketAmex = cleanValue("averageTicketAmex");
  const discountRateAmex = cleanValue("discountRateAmex");
  const serviceFee = cleanValue("serviceFee");
  const geniusSoftware = cleanValue("geniusSoftware");
  const interchangeFee = cleanValue("interchangeFee");
  const customerIntelligence = cleanValue("customerIntelligence");
  const otherMonthly = cleanValue("otherMonthly");
  const geniusHardware = cleanValue("geniusHardware");
 
  const transactionFee = cleanValue("transactionFee");
  const settlementFee = cleanValue("settlementFee");
  const transactionFeeAmex = cleanValue("transactionFeeAmex");
 
  const simplifiedPricingFee = cleanValue("simplifiedPricingFee");
  const associationPricingFee = cleanValue("associationPricingFee");
 
  const transactions = averageTicket ? annualVolume / averageTicket : 0;
  const amexTransactions = averageTicketAmex ? annualVolumeAmex / averageTicketAmex : 0;
 
  let sar = 0;
 
  if (type === "flat") {
    sar =
      (annualVolume * discountRate) +
      (annualVolumeAmex * discountRateAmex) +
      (transactions * authFee) +
      (amexTransactions * authFee) +
      (interchangeFee * (annualVolume + annualVolumeAmex)) +
      ((serviceFee + geniusSoftware + customerIntelligence + otherMonthly + geniusHardware) * 12);
  } else {
    sar =
      (annualVolume * discountRate) +
      (annualVolumeAmex * discountRateAmex) +
      (transactions * (transactionFee + authFee + settlementFee)) +
      (amexTransactions * (transactionFeeAmex + authFee + settlementFee)) +
      (interchangeFee * (annualVolume + annualVolumeAmex)) +
      ((serviceFee + geniusSoftware + customerIntelligence + otherMonthly + geniusHardware) * 12) +
      (annualVolume * (simplifiedPricingFee + associationPricingFee));
  }
 
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
}
 
document.querySelectorAll('input[name="pricingType"]').forEach(radio => {
  radio.addEventListener("change", updatePricingFields);
});
 
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", calculateSAR);
});
 
formatVolumeInput("annualVolume");
formatVolumeInput("annualVolumeAmex");
 
updatePricingFields();
calculateSAR();
