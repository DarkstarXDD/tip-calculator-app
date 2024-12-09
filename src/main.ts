const formEl = document.getElementById("form")
const tipPerPersonEl = document.getElementById("tip-per-person")
const totalPerPersonEl = document.getElementById("total-per-person")

const customRadioButton = document.body.querySelector(".custom-radio-button")
const customInput = document.getElementById("custom-input")

const resetButton = document.getElementById("reset-button")

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

function getFormData(formElement: HTMLFormElement) {
  const formData = new FormData(formElement)

  const billAmount = formData.get("bill-amount")
  let tipPercentage = formData.get("tip-percentage")
  const tipCustom = formData.get("tip-custom")
  const peopleCount = formData.get("people-count")

  if (tipPercentage === "custom") {
    tipPercentage = tipCustom
  }

  return { billAmount, tipPercentage, peopleCount }
}

function resetForm(formElement: HTMLFormElement) {
  const formData = new FormData(formElement)

  formElement.querySelectorAll("input").forEach((element) => {
    if (formData.has(element.name)) {
      element.value = ""

      if (element.type === "radio") {
        element.checked = false
      }
    }
  })
  handleChange()
}

function handleChange() {
  if (formEl instanceof HTMLFormElement) {
    const { billAmount, tipPercentage, peopleCount } = getFormData(formEl)

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

if (customInput) {
  customInput.addEventListener("focus", () => {
    if (customRadioButton instanceof HTMLInputElement) {
      customRadioButton.checked = true
      handleChange()
    }
  })
}

if (customRadioButton) {
  customRadioButton.addEventListener("change", () => {
    customInput?.focus()
  })
}

formEl?.addEventListener("input", handleChange)
resetButton?.addEventListener("click", () => {
  if (formEl instanceof HTMLFormElement) {
    resetForm(formEl)
  }
})
