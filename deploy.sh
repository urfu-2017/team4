#!/bin/bash

now rm k1logram -s -y   # Удаляем старые
npm run deploy          # Деплоим
npm run alias           # Навешиваем алиас
