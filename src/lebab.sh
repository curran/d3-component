# safe
lebab --replace component.js --transform arrow
lebab --replace component.js --transform for-of
lebab --replace component.js --transform for-each
lebab --replace component.js --transform arg-rest
lebab --replace component.js --transform arg-spread
lebab --replace component.js --transform obj-method
lebab --replace component.js --transform obj-shorthand
lebab --replace component.js --transform multi-var
# unsafe
lebab --replace component.js --transform let
lebab --replace component.js --transform template