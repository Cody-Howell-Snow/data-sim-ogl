import React, { ReactNode } from 'react';
import { Simulator } from './Simulator';
import { featurePacks } from './featurePacks';
import { subscriptions } from './subscriptions';

class App extends React.Component<{}, { sim: Simulator, numberOfDays: number, stopAfterValue: number, bools: Array<boolean>, sql: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = {
      sim: new Simulator(new Date('2024/11/19')),
      numberOfDays: 1,
      stopAfterValue: 1000000,
      bools: [false, false, false, false, false, false, false, false, false],
      sql: false
    }
  }

  runSimDay = () => {
    let sim: Simulator = this.state.sim;
    for (let i = 0; i < this.state.numberOfDays; i++) {
      sim.runDate(this.state.stopAfterValue); // Expected size of the largest array
    }
    this.setState({ sim: sim });
  }

  updateDays = (value: any) => {
    this.setState({ numberOfDays: value.target.value });
  }

  updateLargestValue = (value: any) => {
    this.setState({ stopAfterValue: value.target.value });
  }

  toggleIndex = (index: number) => {
    let bools = this.state.bools;
    bools[index] = !bools[index];
    this.setState({ bools: bools });
  }

  toggleSQL = () => {
    this.setState({ sql: !this.state.sql });
  }

  downloadGamePlays = () => {
    exportToCSV(this.state.sim.gamePlays);
  }

  copyInsidesToClipboard = (data: Array<React.ReactNode>) => {
    let strings: Array<string> = [];
    for (let i = 0; i < data.length; i++) {
      strings.push(data[i]!.toString())
    }
    console.log(strings);
    // console.log(data)
  }

  render() {
    let developers: React.ReactNode[] = [];
    let accounts: React.ReactNode[] = [];
    let subPayments: React.ReactNode[] = [];
    let featurePayments: React.ReactNode[] = [];
    let gamePlays: React.ReactNode[] = [];
    let boughtFeatures: React.ReactNode[] = [];
    let games: React.ReactNode[] = [];

    if (this.state.sql) {
      this.state.sim.developers.forEach((value, index) => developers.push(<p key={index}>insert into developers (developer_name, contact_email, revenue_share_percentage) values
        ('{value.developerName}', '{value.contactEmail}', {value.revenueSharePercentage});</p>));

      this.state.sim.accounts.forEach((value, index) => accounts.push(<p key={index}>insert into accounts (user_name, subscriptionId, subscription_start_date, actual_cost, yearly_payment, end_date) values
        ('{value.userName}', {value.subscriptionId !== undefined ? value.subscriptionId : "'null'"}, {value.susbscriptionDate?.toDateString()}, {value.actualCost}, {value.yearlyPayment ? "TRUE" : "FALSE"}, {value.endDate?.toDateString()});</p>));

      this.state.sim.subscriptionPayments.forEach((value, index) => subPayments.push(<p key={index}>insert into payment_subscriptions (account_id, subscription_id, payment_amount, payment_date) values
        ({value.accountId}, {value.subscriptionId}, {value.paymentAmount}, '{value.paymentDate.toDateString()}');</p>));

      this.state.sim.featurePayments.forEach((value, index) => featurePayments.push(<p key={index}>insert into payment_features (account_id, feature_id, payment_amount, payment_date, auto_renew) values
        ({value.accountId}, {value.featureId}, {value.paymentAmount}, '{value.paymentDate.toDateString()}', {value.autoRenew ? "TRUE" : "FALSE"});</p>))

      this.state.sim.accounts.forEach((value, index) => {
        for (let i = 0; i < value.featuresPurchased.length; i++) {
          boughtFeatures.push(<p key={index + " " + i}>insert into feature_account (account_id, feature_id, first_payment_date, auto_renew, actual_cost, yearly_payment, end_date) values
            ({value.id}, {value.featuresPurchased[i].pack.id}, {value.featuresPurchased[i].firstPurchase.paymentDate.toDateString()},
            {value.featuresPurchased[i].firstPurchase.autoRenew}, {value.featuresPurchased[i].firstPurchase.yearly ? "TRUE" : "FALSE"}, {value.featuresPurchased[i].firstPurchase.endDate.toDateString()});</p>)
        }
      });
      this.state.sim.games.forEach((value, index) => {
        games.push(<p key={index}>insert into game (game_name, developer_id) values
          ('{value.gameName}', {value.developerId});</p>);
        value.featureIds.forEach((value2, index) => games.push(<p key={index}>insert into game_in_feature_pack (game_id, feature_pack_id) values
          ({value.id}, {value2}); </p>));
      });

    } else {
      this.state.sim.developers.forEach((value, index) => developers.push(<p key={index}>Id: {value.id} | Name: {value.developerName}</p>));

      this.state.sim.accounts.forEach((value, index) => accounts.push(<p key={index}>Id: {value.id} | Name: {value.userName} |
        Subscription Day: {value.susbscriptionDate?.toDateString()} | End Date: {value.endDate?.toDateString()} | Expected Games: {value.expectedGames}</p>));

      this.state.sim.subscriptionPayments.forEach((value, index) => subPayments.push(<p key={index}>Sub Id: {value.subscriptionId} | Account Id: {value.accountId} |
        Payment Date: {value.paymentDate.toDateString()} | Payment Amount: {value.paymentAmount}</p>));

      this.state.sim.featurePayments.forEach((value, index) => featurePayments.push(<p key={index}>Sub Id: {value.featureId} | Account Id: {value.accountId} |
        Payment Date: {value.paymentDate.toDateString()} | Payment Amount: {value.paymentAmount}</p>))

      this.state.sim.accounts.forEach((value, index) => {
        for (let i = 0; i < value.featuresPurchased.length; i++) {
          boughtFeatures.push(<p key={index + " " + i}>Account: {value.id} | Feature: {value.featuresPurchased[i].pack.id}</p>)
        }
      });
      this.state.sim.games.forEach((value, index) => games.push(<p key={index}>Id: {value.id} | Game Name: {value.gameName} |
        Dev Id: {value.developerId} | Feature Requirements: {value.featureIds.join(', ')}</p>))
      if (this.state.bools[3]) {
        this.state.sim.gamePlays.forEach((value, index) => gamePlays.push(<p key={index}>Player Id: {value.playerId} | Game Id: {value.gameId} |
          Start Time: {value.startTime.toISOString()} | End Time: {value.endTime.toISOString()} | Length: {displayDuration(value.startTime, value.endTime)}</p>))
      }
    }

    let features: React.ReactNode[] = [];
    let subscriptionDisplay: React.ReactNode[] = [];

    featurePacks.forEach((value, index) => features.push(<p key={index}>insert into feature_pack(feature_name, cost_auto_renewal_month, cost_auto_renewal_year, cost_not_auto_renewal_month, cost_not_auto_renewal_year) values
      ('{value.featureName}', {value.costAutoMonth}, {value.costAutoYear}, {value.costNonAutoMonth}, {value.costNonAutoYear})
    </p>));

    subscriptions.forEach((value, index) => subscriptionDisplay.push(<p key={index}>insert into subscription (subc_name, cost_month, cost_year, concurrent_logins) values
      ('{value.subscriptionName}', {value.costMonth}, {value.costYear}, {value.concurrentLogins})</p>));


    return (
      <>
        <h1>Simulator</h1>
        <label htmlFor='sql'>SQL/CSV</label>
        <input type='checkbox' name='sql' id='sql' onChange={this.toggleSQL} value={this.state.sql ? "true" : "false"} />
        <p>Date: {this.state.sim.currentDate.toDateString()}</p>
        <button onClick={this.runSimDay}>Run Day(s)</button>
        <input type='number' value={this.state.numberOfDays} onChange={this.updateDays} placeholder='Number of days per run' />
        <input type='number' value={this.state.stopAfterValue} onChange={this.updateLargestValue} placeholder='Stop value of Game Plays' />
        <hr />

        <div id='displayValues'>
          <div className='displayBox'>
            <h2 onClick={this.downloadGamePlays}>Game Plays ({this.state.sim.gamePlays.length}) <ArrowBool up={this.state.bools[3]} /> </h2>
            {this.state.bools[3] && gamePlays}
          </div>
          <div className='displayBox'>
            <h2 onClick={() => this.toggleIndex(1)}>Accounts ({this.state.sim.accounts.length}) <ArrowBool up={this.state.bools[1]} /> <span onClick={() => copyTextFromParagraphs(accounts)}>Click to copy</span></h2>
            {this.state.bools[1] && accounts}
          </div>
          <div className='displayBox'>
            <h2 onClick={() => this.toggleIndex(4)}>Features Bought ({boughtFeatures.length}) <ArrowBool up={this.state.bools[4]} /> <span onClick={() => copyTextFromParagraphs(boughtFeatures)}>Click to copy</span></h2>
            {this.state.bools[4] && boughtFeatures}
          </div>
          <div className='displayBox'>
            <h2 onClick={() => this.toggleIndex(2)}>Subscription Payments ({this.state.sim.subscriptionPayments.length}) <ArrowBool up={this.state.bools[2]} /> <span onClick={() => copyTextFromParagraphs(subPayments)}>Click to copy</span></h2>
            {this.state.bools[2] && subPayments}
          </div>
          <div className='displayBox'>
            <h2 onClick={() => this.toggleIndex(6)}>Feature Payments ({this.state.sim.featurePayments.length}) <ArrowBool up={this.state.bools[6]} /><span onClick={() => copyTextFromParagraphs(featurePayments)}>Click to copy</span></h2>
            {this.state.bools[6] && featurePayments}
          </div>
          <div className='displayBox'>
            <h2 onClick={() => this.toggleIndex(0)}>Developers ({this.state.sim.developers.length}) <ArrowBool up={this.state.bools[0]} /> <span onClick={() => copyTextFromParagraphs(developers)}>Click to copy</span></h2>
            {this.state.bools[0] && developers}
          </div>
          <div className='displayBox'>
            <h2 onClick={() => this.toggleIndex(5)}>Games ({this.state.sim.games.length}) <ArrowBool up={this.state.bools[5]} /> <span onClick={() => copyTextFromParagraphs(games)}>Click to copy</span></h2>
            {this.state.bools[5] && games}
          </div>
          <div className='displayBox'>
            <h2 onClick={() => this.toggleIndex(7)}>Feature Packs ({featurePacks.length}) <ArrowBool up={this.state.bools[7]} /> <span onClick={() => copyTextFromParagraphs(features)}>Click to copy</span></h2>
            {this.state.bools[7] && features}
          </div>
          <div className='displayBox'>
            <h2 onClick={() => this.toggleIndex(8)}>Subscriptions ({subscriptions.length}) <ArrowBool up={this.state.bools[8]} /> <span onClick={() => copyTextFromParagraphs(subscriptionDisplay)}>Click to copy</span></h2>
            {this.state.bools[8] && subscriptionDisplay}
          </div>
        </div>
      </>
    )
  }
}

class ArrowBool extends React.Component<{ up: boolean }, {}> {
  render() {
    return this.props.up ? (<span>&#x25B2;</span>) : (<span>&#x25BC;</span>)
  }
}

function displayDuration(startDate: Date, endDate: Date) {
  // Convert dates to milliseconds
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  // Calculate difference in milliseconds
  const diff = end - start;

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Format the output string
  let duration = "";
  if (days > 0) duration += `${days} days `;
  if (hours > 0) duration += `${hours} hours `;
  if (minutes > 0) duration += `${minutes} minutes `;
  if (seconds > 0) duration += `${seconds} seconds `;

  return duration;
}

function exportToCSV(data: Array<any>, filename = "data.csv") {
  // Check if the data is valid
  if (!Array.isArray(data) || data.length === 0) {
    console.error("Invalid data: must be a non-empty array of objects.");
    return;
  }

  // Extract column headers (keys of the first object)
  const headers = Object.keys(data[0]);

  // Map the data into CSV format
  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header] ?? ""; // Handle undefined or null values
      return `"${value.toString().replace(/"/g, '""')}"`; // Escape double quotes
    }).join(",")
  );

  // Combine headers and rows
  const csvContent = [headers.join(","), ...csvRows].join("\n");

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);

  // Trigger the download
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

// Function to extract text from an array of <p> nodes
function extractTextFromParagraphs(nodes: React.ReactNode[]): string {
  return nodes
    .map((node) => {
      if (React.isValidElement(node) && node.type === "p") {
        // Assuming node.props.children holds the text content
        const children = node.props.children;

        // Handle cases where children are strings or arrays
        if (typeof children === "string") {
          return children;
        } else if (Array.isArray(children)) {
          return children
            .map((child) =>
              typeof child === "string" || typeof child === "number"
                ? child.toString()
                : ""
            )
            .join("");
        }
      }
      return ""; // Skip invalid or non-<p> elements
    })
    .join("\n"); // Join text from multiple <p> elements with newlines
}

// Copy extracted text to clipboard
function copyTextFromParagraphs(nodes: React.ReactNode[]) {
  const text = extractTextFromParagraphs(nodes);
  navigator.clipboard.writeText(text).then(
    () => console.log("Text copied to clipboard!"),
    (err) => console.error("Failed to copy text: ", err)
  );
}


export default App
