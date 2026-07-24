#!/bin/bash

# Define the BASE URL
# Déclare une table d'association langue → URL
declare -A BLABLACAR_URLS=(
  ["cs"]="https://www.blablacar.cz/"
  ["de"]="https://www.blablacar.de/"
  ["en"]="https://www.blablacar.co.uk/"
  ["in"]="https://www.blablacar.in/"             
  ["es"]="https://www.blablacar.es/"
  ["mx"]="https://www.blablacar.mx/"           
  ["fr"]="https://www.blablacar.fr/"
  ["hr"]="https://www.blablacar.hr/"
  ["hu"]="https://www.blablacar.hu/"
  ["it"]="https://www.blablacar.it/"
  ["nl"]="https://www.blablacar.nl/"
  ["pl"]="https://www.blablacar.pl/"
  ["pt"]="https://www.blablacar.pt/"
  ["br"]="https://www.blablacar.com.br/"         
  ["ro"]="https://www.blablacar.ro/"
  ["ru"]="https://www.blablacar.ru/"
  ["sk"]="https://www.blablacar.sk/"
  ["rs"]="https://www.blablacar.rs/"
  ["tr"]="https://www.blablacar.com.tr/"
  ["ua"]="https://www.blablacar.com.ua/"
  ["be"]="https://www.fr.blablacar.be/"
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
URL=${BLABLACAR_URLS[$LANG_CODE]}

# Fallback si la langue n’existe pas
if [[ -z "$URL" ]]; then
    URL="https://www.blablacar.com/"
fi

echo "$URL"
# Define the base command for webapp-container
 exec webapp-container --open-external-url-in-overlay --webappUrlPatterns="https://*.blablacar.*/*,https://blablacar.*/*" --app-id=\"blablacar.pparent\" --store-session-cookies --webapp-name=\"BlaBlaCar\"  $URL


