# Inventário de cenas 3D

## Resultado atual

**Zero cenas inspecionadas.** Não se confirmou canvas, WebGL/WebGPU, vídeo, modelo, câmera ou pós-processamento da referência (E03). A disponibilidade de WebGL2 no navegador local (E04) não é evidência de seu uso pelo Lusion.

## Ficha de cena para observação

Cada cena deverá receber ID estável, página/trecho, condição de entrada, condição de saída e evidência temporal. Medidas relativas à tela não devem ser apresentadas como coordenadas reais do motor.

| Camada | Como investigar | Limite da conclusão |
| --- | --- | --- |
| Geometria aparente | Silhuetas e oclusões em diferentes ângulos; relacionar a pointer/scroll | Não permite deduzir topologia, ossos ou contagem de polígonos |
| Câmera | Paralaxe relativa, mudança de perspectiva e escala; comparar pontos fixos | Movimento da câmera e do objeto podem produzir projeções semelhantes |
| Transformações | Centro e limites normalizados `x/W`, `y/H`, `w/W`, `h/H` por quadro | Não inferir posição/rotação/escala em unidades 3D sem evidência |
| Materiais | Respostas especulares, rugosidade aparente, transparência, reflexo em movimento | Aparência metálica não prova PBR, HDRI ou ray tracing |
| Iluminação | Direção de highlights/sombras e alterações durante eventos | Luz dinâmica versus textura/luz pré-calculada requer investigação adicional |
| Partículas | Densidade aparente, trajetória, oclusão e reação ao cursor | Pontos luminosos podem ser vídeo, sprites ou geometria |
| Pós-processamento | Bloom, aberração, DOF, ruído, motion blur aparentes; comparação temporal | Nomear efeito percebido separadamente do algoritmo que o produz |
| Gerenciamento | Canvas persistente entre rotas, mudança de resolução e descarte | Um canvas único não prova uma única cena ou um framework específico |
| Relação com scroll | Parar scroll, inverter, repetir posição e comparar estado | Separar animação por tempo, por posição e híbrida |

## Protocolo de comparação

Capturar repouso, mouse nas quatro regiões da tela, mouse parado após movimento, scroll em passos normalizados, scroll inverso e mudança de viewport. Marcar qualquer região em que o vídeo/loader impeça observar o objeto. Emulação móvel não prova comportamento físico de toque, temperatura ou GPU.

Nenhum recurso 3D da referência deve ser exportado como ativo do projeto. O futuro inventário de produção deverá conter autoria, licença, orçamento de geometria/texturas e estados próprios, separado deste registro observacional.
