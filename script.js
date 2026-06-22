function num(id) {
  return Number(document.getElementById(id).value) || 0;
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
 
function toggleFields() {
  const type = getPricingType();
 
  document.querySelectorAll(".pass-only").forEach(el => {
    el.classList.toggle("hidden", type !== "pass");
  });
 
  calculateSAR();
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
 
  const transactions = averageTicket === 0 ? 0 : annualVolume / averageTicket;
  const amexTransactions = averageTicketAmex === 0 ? 0 : annualVolumeAmex / averageTicketAmex;
 
  let sar = 0;
 
  if (type === "flat") {
    sar =
      (annualVolume * discountRate) +
      (annualVolumeAmex * discountRateAmex) +
      (transactions * (transactionFee + authFee)) +
      (amexTransactions * (transactionFeeAmex + authFee)) +
      (interchangeFee * (annualVolume + annualVolumeAmex)) +
      ((serviceFee + geniusSoftware + customerIntelligence + otherMonthly + geniusHardware) * 12) +
      (annualVolume * settlementFee);
  }
 
  if (type === "pass") {
    sar =
      (annualVolume * discountRate) +
      (annualVolumeAmex * discountRateAmex) +
      (transactions * (transactionFee + authFee)) +
      (amexTransactions * (transactionFeeAmex + authFee)) +
      (interchangeFee * (annualVolume + annualVolumeAmex)) +
      ((serviceFee + geniusSoftware + customerIntelligence + otherMonthly + geniusHardware) * 12) +
      (annualVolume * settlementFee);
  }
 
  document.getElementById("sarResult").textContent = money(sar);
 
  document.getElementById("breakdown").innerHTML = `
    <strong>Pricing Type:</strong> ${type === "flat" ? "Flat Rate" : "Pass Through"}<br>
    <strong>SAR:</strong> ${money(sar)}
  `;
}
 
document.querySelectorAll('input[name="pricingType"]').forEach(radio => {
  radio.addEventListener("change", toggleFields);
});
 
document.getElementById("calculateBtn").addEventListener("click", calculateSAR);
 
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", calculateSAR);
});
 
toggleFields();
calculateSAR();

function formatNumberInput(input) {
  input.addEventListener("blur", function () {
    const value = this.value.replace(/,/g, "");
 
    if (value === "" || isNaN(value)) return;
 
    this.value = Number(value).toLocaleString("en-US");
  });
 
  input.addEventListener("focus", function () {
    this.value = this.value.replace(/,/g, "");
  });
}
 
[
  "annualVolume",
  "annualVolumeAmex"
].forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    formatNumberInput(element);
  }
});
 
