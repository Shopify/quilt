# Migration guide

This is a concise summary of changes and recommendations around updating `@shopify/react-i18n` in consuming projects. For a more detailed list of changes, see [the changelog](./CHANGELOG.md).

## [Unreleased]

🛑Breaking change - New translation key is needed for future 'today' date formatted with `DateStyle.Humanize`. Consumers will need to add the translation key as outlined below.

```json
"date": {
  "humanize": {
    ...
    "today": "Today at {time}"
  }
},
```

## [3.0.0] - 2020-04-23

🛑Breaking change - New translation key is needed for future dates formatted with `DateStyle.Humanize`. Consumers will need to add the translation key as outlined below.

```json
"date": {
  "humanize": {
    ...
    "tomorrow": "Tomorrow at {time}"
  }
},
```

## [2.0.0] - 2019-09-19

🛑Breaking change - The translation keys for dates formatted with `DateStyle.Humanize` have changed. Consumers will need to modify the translation keys as outlined below.

1. The top-level "humanize" key is now nested under a "date" key.

   **Before**

   ```json
   {
     "humanize": {
       ...
     }
   }
   ```

   **After**

   ```json
   {
     "date": {
       "humanize": {
         ...
       }
     }
   }
   ```

2. The `day` replacement parameter for the `lessThanOneWeekAgo` (formerly `weekday`) string has been renamed to `weekday`.

   **Before**

   ```json
   "weekday": "{day} at {time}",
   ```

   **After**

   ```json
   "lessThanOneWeekAgo": "{weekday} at {time}"
   ```

3. The individual date string keys have been renamed as shown in the following table.

   | Original Key | New Key                |
   | ------------ | ---------------------- |
   | `now`        | `lessThanOneMinuteAgo` |
   | `minutes`    | `lessThanOneHourAgo`   |
   | `yesterday`  | `yesterday`            |
   | `weekday`    | `lessThanOneWeekAgo`   |
   | `date`       | `lessThanOneYearAgo`   |

   **Example before**

   ```json
   {
     "humanize": {
       "date": "{date} at {time}",
       "minutes": "{count} minutes ago",
       "now": "Just now",
       "weekday": "{day} at {time}",
       "yesterday": "Yesterday at {time}"
     }
   }
   ```

   **Example after**

   ```json
   "date": {
     "humanize": {
       "lessThanOneMinuteAgo": "Just now",
       "lessThanOneHourAgo": "{count} minutes ago",
       "yesterday": "Yesterday at {time}",
       "lessThanOneWeekAgo": "{weekday} at {time}",
       "lessThanOneYearAgo": "{date} at {time}"
     }
   },
   ```
