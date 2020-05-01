const polarisCss = `html,
body {
  min-height: 100%;
  height: 100%;
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 2rem;
  text-transform: initial;
  letter-spacing: initial;
  font-weight: 400;
  color: #212b36;
  font-family: -apple-system, BlinkMacSystemFont, San Francisco, Roboto,
    Segoe UI, Helvetica Neue, sans-serif;
}

@media (min-width: 40em) {
  html,
  body {
    font-size: 1.4rem;
  }
}

html {
  position: relative;
  font-size: 62.5%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  text-size-adjust: 100%;
  text-rendering: optimizeLegibility;
}

body {
  min-height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f4f6f8;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin: 0;
  font-size: 1em;
  font-weight: 400;
}

#CookiePartitionPrompt, #RequestStorageAccess {
  display: none;
}

.Polaris-Page {
  margin: 0 auto;
  padding: 0;
  max-width: 99.8rem;
}

@media (min-width: 30.625em) {
  .Polaris-Page {
    padding: 0 2rem;
  }
}
@media (min-width: 46.5em) {
  .Polaris-Page {
    padding: 0 3.2rem;
  }
}

.Polaris-Page__Content {
  margin: 2rem 0;
}

@media (min-width: 46.5em) {
  .Polaris-Page__Content {
    margin-top: 2rem;
  }
}

@media (min-width: 46.5em) {
  .Polaris-Page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
}

.Polaris-Layout {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  margin-top: -2rem;
  margin-left: -2rem;
}

.Polaris-Layout__Section {
  -webkit-box-flex: 2;
  -ms-flex: 2 2 48rem;
  flex: 2 2 48rem;
  min-width: 51%;
}

.Polaris-Layout__Section--fullWidth {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 100%;
  flex: 1 1 100%;
}

.Polaris-Layout__Section {
  max-width: calc(100% - 2rem);
  margin-top: 2rem;
  margin-left: 2rem;
}

.Polaris-Stack {
  margin-top: -1.6rem;
  margin-left: -1.6rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
}

.Polaris-Stack > .Polaris-Stack__Item {
  margin-top: 1.6rem;
  margin-left: 1.6rem;
  max-width: calc(100% - 1.6rem);
}

.Polaris-Stack__Item {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  min-width: 0;
}

.Polaris-Heading {
  font-size: 1.7rem;
  font-weight: 600;
  line-height: 2.4rem;
  margin: 0;
}

@media (min-width: 40em) {
  .Polaris-Heading {
    font-size: 1.6rem;
  }
}

.Polaris-Card {
  overflow: hidden;
  background-color: white;
  box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
    0 1px 3px 0 rgba(63, 63, 68, 0.15);
}

.Polaris-Card + .Polaris-Card {
  margin-top: 2rem;
}

@media (min-width: 30.625em) {
  .Polaris-Card {
    border-radius: 3px;
  }
}

.Polaris-Card__Header {
  padding: 2rem 2rem 0;
}

.Polaris-Card__Section {
  padding: 2rem;
}

.Polaris-Card__Section + .Polaris-Card__Section {
  border-top: 1px solid #dfe3e8;
}

.Polaris-Card__Section--subdued {
  background-color: #f9fafb;
}

.Polaris-Stack--distributionTrailing {
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
}

.Polaris-Stack--vertical {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

.Polaris-Button {
  fill: #637381;
  position: relative;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  min-height: 3.6rem;
  min-width: 3.6rem;
  margin: 0;
  padding: 0.7rem 1.6rem;
  background: linear-gradient(to bottom, white, #f9fafb);
  border: 1px solid #c4cdd5;
  box-shadow: 0 1px 0 0 rgba(22, 29, 37, 0.05);
  border-radius: 3px;
  line-height: 1;
  color: #212b36;
  text-align: center;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-decoration: none;
  transition-property: background, border, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.64, 0, 0.35, 1);
}

.Polaris-Button:hover {
  background: linear-gradient(to bottom, #f9fafb, #f4f6f8);
  border-color: #c4cdd5;
}

.Polaris-Button:focus {
  border-color: #5c6ac4;
  outline: 0;
  box-shadow: 0 0 0 1px #5c6ac4;
}

.Polaris-Button:active {
  background: linear-gradient(to bottom, #f4f6f8, #f4f6f8);
  border-color: #c4cdd5;
  box-shadow: 0 0 0 0 transparent, inset 0 1px 1px 0 rgba(99, 115, 129, 0.1),
    inset 0 1px 4px 0 rgba(99, 115, 129, 0.2);
}

.Polaris-Button.Polaris-Button--disabled {
  fill: #919eab;
  transition: none;
  background: linear-gradient(to bottom, #f4f6f8, #f4f6f8);
  color: #919eab;
}

.Polaris-Button__Content {
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.6rem;
  text-transform: initial;
  letter-spacing: initial;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-width: 1px;
  min-height: 1px;
}

@media (min-width: 40em) {
  .Polaris-Button__Content {
    font-size: 1.4rem;
  }
}

.Polaris-Button--primary {
  background: linear-gradient(to bottom, #6371c7, #5563c1);
  border-color: #3f4eae;
  box-shadow: inset 0 1px 0 0 #6774c8, 0 1px 0 0 rgba(22, 29, 37, 0.05),
    0 0 0 0 transparent;
  color: white;
  fill: white;
}

.Polaris-Button--primary:hover {
  background: linear-gradient(to bottom, #5c6ac4, #4959bd);
  border-color: #3f4eae;
  color: white;
  text-decoration: none;
}

.Polaris-Button--primary:focus {
  border-color: #202e78;
  box-shadow: inset 0 1px 0 0 #6f7bcb, 0 1px 0 0 rgba(22, 29, 37, 0.05),
    0 0 0 1px #202e78;
}

.Polaris-Button--primary:active {
  background: linear-gradient(to bottom, #3f4eae, #3f4eae);
  border-color: #38469b;
  box-shadow: inset 0 0 0 0 transparent, 0 1px 0 0 rgba(22, 29, 37, 0.05),
    0 0 1px 0 #38469b;
}

.Polaris-Button--primary.Polaris-Button--disabled {
  fill: white;
  background: linear-gradient(to bottom, #bac0e6, #bac0e6);
  border-color: #a7aedf;
  box-shadow: none;
  color: white;
}`;

export default polarisCss;
