const formEl = document.getElementById("form")
const tipPerPersonEl = document.getElementById("tip-per-person")
const totalPerPersonEl = document.getElementById("total-per-person")

function calculateTipData(
  billAmount: number,
  tipPercentage: number,
  peopleCount: number
) {
  const tip = billAmount * (tipPercentage / 100)
  const tipPerPerson = tip / peopleCount

  const totalBillWithTip = billAmount + tip
  const totalPerPerson = totalBillWithTip / peopleCount

  return {
    tipPerPerson,
    totalPerPerson,
  }
}

function handleChange() {
  if (formEl instanceof HTMLFormElement) {
    const formData = new FormData(formEl)

    const billAmount = formData.get("bill-amount")
    const tipPercentage = formData.get("tip-percentage")
    const peopleCount = formData.get("people-count")

    const { tipPerPerson, totalPerPerson } = calculateTipData(
      Number(billAmount),
      Number(tipPercentage),
      Number(peopleCount)
    )

    if (tipPerPersonEl) {
      tipPerPersonEl.innerHTML = tipPerPerson.toFixed(2)
    }

    if (totalPerPersonEl) {
      totalPerPersonEl.innerHTML = totalPerPerson.toFixed(2)
    }
  }
}

formEl?.addEventListener("input", handleChange)
