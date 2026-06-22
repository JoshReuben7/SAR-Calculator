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
  const simplifiedPricingFee = num("simplifiedPricingFee");
  const associationPricingFee = num("associationPricingFee");
  const geniusSoftware = num("geniusSoftware");
  const interchangeFee = num("interchangeFee");

  const otherMonthly = num("otherMonthly");
  const customerIntelligence = num("customerIntelligence");
  const geniusHardware = num("geniusHardware");

  const transactions = averageTicket === 0 ? 0 : annualVolume / averageTicket;
  const amexTransactions = averageTicketAmex === 0 ? 0 : annualVolumeAmex / averageTicketAmex;

  const discountRevenue = annualVolume * discountRate;
  const amexDiscountRevenue = annualVolumeAmex * discountRateAmex;

  const transactionRevenue = transactions * (transactionFee + authFee + settlementFee);
  const amexTransactionRevenue = amexTransactions * (transactionFeeAmex + settlementFee);

  const monthlyRevenue =
    (serviceFee + geniusSoftware + otherMonthly + customerIntelligence + geniusHardware) * 12;

  let passThroughRevenue = 0;

  if (type === "pass") {
    passThroughRevenue =
      annualVolume * (simplifiedPricingFee + associationPricingFee + interchangeFee);
  }

  // Formula based on the spreadsheet screenshots:
  // SAR = volume rate revenue + Amex revenue + transaction/auth/settlement fees
  //     + monthly fees annualized + pass-through pricing fees when applicable.
  const sar =
    discountRevenue +
    amexDiscountRevenue +
    transactionRevenue +
    amexTransactionRevenue +
    monthlyRevenue +
    passThroughRevenue;

  document.getElementById("sarResult").textContent = money(sar);

  document.getElementById("breakdown").innerHTML = `
    <strong>Pricing Type:</strong> ${type === "flat" ? "Flat Rate" : "Pass Through"}<br>
    <strong>Card Volume Revenue:</strong> ${money(discountRevenue)}<br>
    <strong>Amex Revenue:</strong> ${money(amexDiscountRevenue)}<br>
    <strong>Transaction/Auth/Settlement Revenue:</strong> ${money(transactionRevenue + amexTransactionRevenue)}<br>
    <strong>Monthly Fees Annualized:</strong> ${money(monthlyRevenue)}<br>
    <strong>Pass Through Pricing Fees:</strong> ${money(passThroughRevenue)}
  `;
}

document.querySelectorAll('input[name="pricingType"]').forEach(radio => {
  radio.addEventListener("change", () => {
    toggleFields();
    calculateSAR();
  });
});

document.getElementById("calculateBtn").addEventListener("click", calculateSAR);

document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", calculateSAR);
});

toggleFields();
calculateSAR();
