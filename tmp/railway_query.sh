#!/usr/bin/env bash
TOKEN="f540a095-4bde-412f-b2f5-02026e566320"
read -r -d '' QUERY <<'GQL'
{ viewer { projects { edges { node { id name } } } } }
GQL
curl -s -X POST https://backboard.railway.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"query\":\"$QUERY\"}" | jq
