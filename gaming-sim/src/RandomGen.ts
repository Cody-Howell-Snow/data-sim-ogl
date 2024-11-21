import { firstNames, lastNames } from "./names";
import { games } from "./games";
import { subscriptions } from "./subscriptions";

export class RandomGen {
  /**
   * @param {number} x - Start value
   * @param {number} y - End value (exclusive)
   */
  public static randNumberBetween(x: number, y: number): number {
    return Math.floor(Math.random() * (y - x)) + x;
  }

  public static randSortedArrayOfDates(day: Date, size: number): Array<Date> {
    let values: Array<Date> = [];
    for (let i = 0; i < size; i++) {
      values.push(this.randTimeOnDate(day));
    }
    values.sort((a, b) => a.getTime() - b.getTime());

    return values;
  }

  /**
   *
   * @returns A new date object with the time scrambled
   */
  private static randTimeOnDate(day: Date): Date {
    let newDate = new Date(day);
    newDate.setHours(this.randNumberBetween(0, 24));
    newDate.setMinutes(this.randNumberBetween(0, 60));
    newDate.setSeconds(this.randNumberBetween(0, 60));

    return newDate;
  }

  public static randDeveloperArray(count: number): Array<Developer> {
    let developers: Array<Developer> = [];
    for (let i = 0; i < count; i++) {
      developers.push(this.randDeveloper(i));
    }
    return developers;
  }

  private static randDeveloper(id: number): Developer {
    let name = this.randName();
    let contactEmail = name.replace(/ /g, "_") + "@example.com";
    return {
      id: id,
      developerName: name,
      contactEmail: contactEmail,
      revenueSharePercentage: this.normalDistribution(0.11) / 100,
    };
  }

  public static randGames(
    devs: Array<Developer>,
    features: Array<FeaturePack>
  ): Array<Game> {
    let outGames: Array<Game> = [];
    for (let i = 0; i < games.length; i++) {
      let featureArray: Array<number> = [];
      for (let j = 0; j < features.length; j++) {
        if (0.7 < Math.random()) {
          featureArray.push(features[j].id);
        }
      }
      outGames.push({
        id: i,
        gameName: games[this.randNumberBetween(0, games.length)],
        developerId: devs[this.randNumberBetween(0, devs.length)].id,
        featureIds: featureArray,
      });
    }
    return outGames;
  }

  public static randGamesWithReplacement(
    count: number,
    games: Array<Game>,
    featureIds: Array<number>
  ): Array<number> {
    let playableGames: Array<number> = [];
    for (let i = 0; i < games.length; i++) {
      if (games[i].featureIds.length == 0) {
        playableGames.push(games[i].id);
      } else {
        for (let i = 0; i < featureIds.length; i++) {
          if (games[i].featureIds.includes(featureIds[i])) {
            playableGames.push(games[i].id);
            break; // Start on the next game
          }
        }
      }
    }

    let playedGames: Array<number> = [];
    for (let i = 0; i < count; i++) {
      playedGames.push(playableGames[this.randNumberBetween(0, playableGames.length - 1)]);
    }

    return playedGames;
  }

  public static randAccount(currentDay: Date, id: number): Account {
    let subscription =
      subscriptions[this.randNumberBetween(0, subscriptions.length - 1)];
    let yearly = Math.random() < 0.5 ? true : false;
    // let yearly = true; // Used for testing
    let cost = yearly ? subscription.costYear : subscription.costMonth;
    let aYearFromNow = new Date(
      currentDay.getFullYear() + 1,
      currentDay.getMonth(),
      currentDay.getDay()
    );
    let aMonthFromNow = new Date(
      currentDay.getFullYear(),
      currentDay.getMonth() + 1,
      currentDay.getDay()
    );
    return {
      id: id,
      userName: this.randName(),
      subscriptionId: subscription.id,
      susbscriptionDate: new Date(currentDay),
      actualCost: cost,
      yearlyPayment: yearly,
      endDate: yearly ? aYearFromNow : aMonthFromNow,
      expectedGames: this.randNumberBetween(1, 10),
      featuresPurchased: []
    };
  }

  private static randName(): string {
    return (
      firstNames[this.randNumberBetween(0, firstNames.length)] +
      " " +
      lastNames[this.randNumberBetween(0, lastNames.length)]
    );
  }

  /**
   *
   * @param percent The expected value after 100 runs
   * @returns A number somewhat normally distributed around it. Better for smaller numbers, given by ChatGPT.
   */
  public static normalDistribution(percent: number): number {
    // Central Limit Theorem approximation with 12 samples
    const samples = 12;
    let sum = 0;

    for (let i = 0; i < samples; i++) {
      sum += Math.random();
    }

    // Normalize sum to mean 0 and variance 1
    const normalized = (sum - samples / 2) / Math.sqrt(samples / 12);

    // Scale to match the percentage range
    const mean = percent * 100;
    const standardDeviation = mean * 0.2; // 20% of the mean for variability
    const result = Math.round(mean + normalized * standardDeviation);

    // Clamp result to ensure reasonable bounds
    const min = Math.max(0, Math.floor(mean - 3 * standardDeviation));
    const max = Math.min(100, Math.ceil(mean + 3 * standardDeviation));
    return Math.max(min, Math.min(max, result));
  }
}
