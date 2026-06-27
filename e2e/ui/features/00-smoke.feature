Feature: Smoke

    Scenario: Startsidan går att öppna
        Given att jag öppnar sidan "http://localhost:3000/"
        Then ska jag se sidans titel innehåller "React App"