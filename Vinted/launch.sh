#!/bin/bash

# Define the BASE URL
# Déclare une table d'association langue → URL
declare -A VINTED_URLS=(
  ["at"]="https://www.vinted.at/"
  ["be"]="https://www.vinted.be/"
  ["cs"]="https://www.vinted.cz/"
  ["de"]="https://www.vinted.de/"
  ["dk"]="https://www.vinted.dk/"
  ["ee"]="https://www.vinted.ee/"
  ["es"]="https://www.vinted.es/"
  ["fi"]="https://www.vinted.fi/"
  ["fr"]="https://www.vinted.fr/"
  ["gr"]="https://www.vinted.gr/"
  ["hr"]="https://www.vinted.hr/"
  ["hu"]="https://www.vinted.hu/"
  ["ie"]="https://www.vinted.ie/"
  ["it"]="https://www.vinted.it/"
  ["lt"]="https://www.vinted.lt/"
  ["lu"]="https://www.vinted.lu/"
  ["lv"]="https://www.vinted.lv/"
  ["nl"]="https://www.vinted.nl/"
  ["pl"]="https://www.vinted.pl/"
  ["pt"]="https://www.vinted.pt/"
  ["ro"]="https://www.vinted.ro/"
  ["se"]="https://www.vinted.se/"
  ["si"]="https://www.vinted.si/"
  ["sk"]="https://www.vinted.sk/"
  ["uk"]="https://www.vinted.co.uk/"
  ["us"]="https://www.vinted.com/"
)

LANG_CODE="${LANG%%_*}"
LANGc="${LANG%%.*}"

# Traitement spécial (langues doubles)
case "$LANGc" in
  "en_IN"*) LANG_CODE="in" ;;
  "es_MX"*) LANG_CODE="mx" ;;
  "pt_BR"*) LANG_CODE="br" ;;
  "fr_BE"*) LANG_CODE="be" ;;
esac

# Récupération de l’URL
URL=${VINTED_URLS[$LANG_CODE]}

# Fallback si la langue n’existe pas
if [[ -z "$URL" ]]; then
    URL="https://www.vinted.com/"
fi

echo "$URL"
USER_AGENT="'Mozilla/5.0 ( Linux; Mobile; Ubuntu 20.04 Like Android 9 ) Firefox/140.0.2-1'"
# Define the base command for webapp-container
exec webapp-container --app-id=\"vinted.pparent\" --store-session-cookies --webapp-name=\"Vinted\"  $URL

