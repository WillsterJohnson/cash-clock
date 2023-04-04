<script lang="ts">
  import { Calendar, type Currency } from "$lib/calendar.js";

  let currency = Calendar.currency;
  $: if (currencyKey) currency = Calendar.currency;

  let hourly = Calendar.hourlyPay.toFixed(Calendar.currencyPrecision);
  $: Calendar.hourlyPay = +hourly;

  const currencyOptions: Currency[] = [
    {
      symbol: "£",
      precision: 2,
    },
    {
      symbol: "$",
      precision: 2,
    },
    {
      symbol: "€",
      precision: 2,
    },
    {
      symbol: "¥",
      precision: 0,
    },
    {
      symbol: "₹",
      precision: 2,
    },
  ];
  let currencyKey = currencyOptions
    .findIndex(({ symbol }) => symbol === Calendar.currency)
    .toString();
  $: Calendar.fullCurrency = currencyOptions[+currencyKey];
</script>

<div>
  <ul>
    <li>
      <label>
        <span class="label">Hourly Pay</span>
        <span class="input">
          <select bind:value={currencyKey}>
            <option value="0">£</option>
            <option value="1">$</option>
            <option value="2">€</option>
            <option value="3">¥</option>
            <option value="4">₹</option>
          </select><input type="text" pattern="\d+\.\d\d" bind:value={hourly} />
        </span>
      </label>
    </li>
  </ul>
</div>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-block: 20vmin;
    height: 100vh;
    font-size: 5vmin;
    background: var(--background);
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    border-radius: 3vmin;
    overflow: hidden;
    border: var(--background-elevated) 1px solid;
  }
  li {
    padding: 3vmin;
    &:not(:last-child) {
      border-bottom: var(--background-elevated) 1px solid;
    }
  }
  label {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 80vw;
  }
  input,
  select {
    border: none;
    margin: 0;
    color: inherit;
    font: inherit;
    font-size: 5vmin;
    padding: 1vmin;
    height: 10vmin;
    border-bottom: var(--foreground) 1px solid;
    background: var(--background-elevated);
    transition: 250ms ease;
    &:first-child {
      border-top-left-radius: 2vmin;
    }
    &:last-child {
      border-top-right-radius: 2vmin;
    }
  }
  input {
    width: 20vmin;
  }
</style>
