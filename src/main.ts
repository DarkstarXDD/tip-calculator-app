import { z } from "zod"

const formEl = document.getElementById("form")
const billAmountInputEl = document.getElementById("bill-amount")
const tipPerPersonEl = document.getElementById("tip-per-person")
const totalPerPersonEl = document.getElementById("total-per-person")

const customRadioButton = document.body.querySelector(".custom-radio-button")
const customInput = document.getElementById("custom-input")

const resetButton = document.getElementById("reset-button")

const billErrorEl = document.getElementById("error-bill")
const tipErrorEl = document.getElementById("error-tip")
const poepleCountErrorEl = document.getElementById("error-count")

const numberErrorMessage = "Must be a number"

const FormSchema = z.object({
  "bill-amount": z.coerce
    .number({ invalid_type_error: numberErrorMessage })
    .nonnegative("Can't be negative"),

  "tip-percentage": z.coerce
    .number({
      invalid_type_error: numberErrorMessage,
    })
    .or(z.enum(["custom"]))
    .optional(),

  "tip-custom": z.coerce
    .number({ invalid_type_error: numberErrorMessage })
    .nonnegative("Can't be negative"),

  "people-count": z.coerce
    .number({ invalid_type_error: numberErrorMessage })
    .positive("Can't be zero")
    .int("Whole numbers only"),
})

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

  const formDataObject = Object.fromEntries(formData)
  const validatedData = validateFormData(formDataObject)

  const billAmount = validatedData?.["bill-amount"] || 0
  let tipPercentage = validatedData?.["tip-percentage"] || 0
  const tipCustom = validatedData?.["tip-custom"] || 0
  const peopleCount = validatedData?.["people-count"] || 1

  if (tipPercentage === "custom") {
    tipPercentage = tipCustom
  }

  return { billAmount, tipPercentage, peopleCount }
}

type FormType = z.infer<typeof FormSchema>
type FormInput = keyof FormType
type FormErrors = Partial<Record<FormInput, string[]>>

function validateFormData(formDataObject: unknown) {
  let errorObj: FormErrors
  const parseResult = FormSchema.safeParse(formDataObject)

  if (parseResult.success) {
    errorObj = {}
    handleErrorMessages(errorObj)
    return parseResult.data
  } else {
    errorObj = parseResult.error.flatten().fieldErrors
    handleErrorMessages(errorObj)
  }
}

function handleErrorMessages(errorObj: FormErrors) {
  if (billErrorEl) {
    billErrorEl.innerHTML = errorObj["bill-amount"]?.[0] || ""
  }
  if (tipErrorEl) {
    tipErrorEl.innerHTML = errorObj["tip-percentage"]?.[0] || ""
  }
  if (tipErrorEl) {
    tipErrorEl.innerHTML = errorObj["tip-custom"]?.[0] || ""
  }
  if (poepleCountErrorEl) {
    poepleCountErrorEl.innerHTML = errorObj["people-count"]?.[0] || ""
  }
}

function resetForm(formElement: HTMLFormElement) {
  billAmountInputEl?.focus()
  formElement.reset()
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
